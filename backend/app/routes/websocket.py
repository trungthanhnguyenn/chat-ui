"""
WebSocket route for real-time chat streaming
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services import get_llm_service, MemoryService, get_provider
from app.models import WebSocketMessage
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: dict = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept and store WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, client_id: str):
        """Remove WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_message(self, client_id: str, message: dict):
        """Send message to specific client"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            await websocket.send_json(message)


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    WebSocket endpoint for real-time chat streaming
    
    Message format:
    {
        "type": "chat",
        "data": {
            "message": "user message",
            "user_id": "user_123",
            "session_id": "session_456",
            "model": "optional-model-name"
        }
    }
    """
    await manager.connect(websocket, client_id)
    llm_service = get_llm_service()
    memory_service = MemoryService(db)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            logger.info(f"Received message from {client_id}: {data[:100]}...")
            
            try:
                message_data = json.loads(data)
                message_type = message_data.get("type", "chat")
                payload = message_data.get("data", {})
                
                if message_type == "chat":
                    await handle_chat_message(
                        websocket,
                        payload,
                        llm_service,
                        memory_service
                    )
                
                elif message_type == "history":
                    await handle_history_request(
                        websocket,
                        payload,
                        memory_service
                    )
                
                elif message_type == "ping":
                    await websocket.send_json({"type": "pong", "data": {}})
                
                else:
                    await websocket.send_json({
                        "type": "error",
                        "data": {"error": f"Unknown message type: {message_type}"}
                    })
                    
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e}")
                await websocket.send_json({
                    "type": "error",
                    "data": {"error": "Invalid JSON format"}
                })
            
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                await websocket.send_json({
                    "type": "error",
                    "data": {"error": str(e)}
                })
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        logger.info(f"Client {client_id} disconnected")
    
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        manager.disconnect(client_id)


async def handle_chat_message(
    websocket: WebSocket,
    payload: dict,
    llm_service,
    memory_service: MemoryService
):
    """Handle chat message and stream response"""
    user_message = payload.get("message", "")
    user_id = payload.get("user_id", "")
    session_id = payload.get("session_id", "")
    model = payload.get("model")
    provider_id = payload.get("provider_id")  # NEW: support provider selection
    
    if not user_message or not user_id or not session_id:
        await websocket.send_json({
            "type": "error",
            "data": {"error": "Missing required fields: message, user_id, session_id"}
        })
        return
    
    try:
        # Get the appropriate provider
        try:
            provider = get_provider(provider_id)
            logger.info(f"Using provider: {provider.provider_id} ({provider.name})")
        except ValueError as e:
            logger.error(f"Invalid provider: {e}")
            await websocket.send_json({
                "type": "error",
                "data": {"error": str(e)}
            })
            return
        
        # Get conversation history
        history = await memory_service.get_history(user_id, session_id, limit=20)
        
        # Format messages for the provider
        messages = provider.format_chat_history(history)
        messages.append({"role": "user", "content": user_message})
        
        # Send start signal
        logger.info(f"[STREAM] Sending stream_start for session {session_id} using {provider.provider_id}")
        await websocket.send_json({
            "type": "stream_start",
            "data": {"provider": provider.provider_id}
        })
        
        # Stream response from provider
        full_response = ""
        chunk_count = 0
        async for chunk in provider.chat_completion_stream(messages, model=model):
            chunk_count += 1
            full_response += chunk
            logger.debug(f"[STREAM] Chunk {chunk_count}: {repr(chunk)[:50]}")
            await websocket.send_json({
                "type": "stream_chunk",
                "data": {"chunk": chunk}
            })
        
        # Send end signal
        logger.info(f"[STREAM] Sending stream_end. Provider: {provider.provider_id}, Total chunks: {chunk_count}, Response length: {len(full_response)}")
        await websocket.send_json({
            "type": "stream_end",
            "data": {
                "full_response": full_response,
                "provider": provider.provider_id
            }
        })
        
        # Save conversation to database
        await memory_service.save_conversation(
            user_id=user_id,
            session_id=session_id,
            user_message=user_message,
            assistant_message=full_response
        )
        
        logger.info(f"Chat completed for session {session_id}")
        
    except Exception as e:
        logger.error(f"Error in chat handler: {e}")
        await websocket.send_json({
            "type": "error",
            "data": {"error": str(e)}
        })


async def handle_history_request(
    websocket: WebSocket,
    payload: dict,
    memory_service: MemoryService
):
    """Handle history request"""
    user_id = payload.get("user_id", "")
    session_id = payload.get("session_id", "")
    limit = payload.get("limit", 50)
    
    if not user_id or not session_id:
        await websocket.send_json({
            "type": "error",
            "data": {"error": "Missing required fields: user_id, session_id"}
        })
        return
    
    try:
        history = await memory_service.get_history(user_id, session_id, limit=limit)
        
        await websocket.send_json({
            "type": "history",
            "data": {
                "messages": history,
                "count": len(history)
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        await websocket.send_json({
            "type": "error",
            "data": {"error": str(e)}
        })
