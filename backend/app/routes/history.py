"""
History management routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services import MemoryService
from app.models import (
    HistoryRequest,
    HistoryResponse,
    SaveHistoryRequest,
    ConversationListResponse,
    ConversationInfo,
    ChatMessage
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/history", tags=["history"])


@router.post("/get", response_model=HistoryResponse)
async def get_conversation_history(
    request: HistoryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Get conversation history for a specific session
    
    Args:
        request: HistoryRequest with user_id, session_id, and optional limit
        
    Returns:
        HistoryResponse with list of messages
    """
    try:
        memory_service = MemoryService(db)
        
        messages = await memory_service.get_history(
            user_id=request.user_id,
            session_id=request.session_id,
            limit=request.limit or 50
        )
        
        chat_messages = [
            ChatMessage(
                role=msg["role"],
                content=msg["content"],
                timestamp=msg.get("timestamp")
            )
            for msg in messages
        ]
        
        return HistoryResponse(
            success=True,
            messages=chat_messages,
            count=len(chat_messages)
        )
        
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save")
async def save_conversation_history(
    request: SaveHistoryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Save conversation messages to history
    
    Args:
        request: SaveHistoryRequest with user_id, session_id, and messages
        
    Returns:
        Success status
    """
    try:
        memory_service = MemoryService(db)
        
        success = await memory_service.save_conversation(
            user_id=request.user_id,
            session_id=request.session_id,
            user_message=request.user_message,
            assistant_message=request.assistant_message
        )
        
        if success:
            return {"success": True, "message": "History saved successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to save history")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{user_id}", response_model=ConversationListResponse)
async def get_user_sessions(
    user_id: str,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all conversation sessions for a user
    
    Args:
        user_id: User identifier
        limit: Maximum number of sessions to return
        
    Returns:
        ConversationListResponse with list of sessions
    """
    try:
        memory_service = MemoryService(db)
        
        sessions = await memory_service.get_user_sessions(
            user_id=user_id,
            limit=limit
        )
        
        conversations = [
            ConversationInfo(
                session_id=session["session_id"],
                title=session.get("title"),
                created_at=session["created_at"],
                updated_at=session["updated_at"],
                message_count=session.get("message_count", 0)
            )
            for session in sessions
        ]
        
        return ConversationListResponse(
            success=True,
            conversations=conversations,
            count=len(conversations)
        )
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/session/{user_id}/{session_id}")
async def delete_conversation_session(
    user_id: str,
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a conversation session
    
    Args:
        user_id: User identifier
        session_id: Session identifier
        
    Returns:
        Success status
    """
    try:
        memory_service = MemoryService(db)
        
        success = await memory_service.delete_session(
            user_id=user_id,
            session_id=session_id
        )
        
        if success:
            return {"success": True, "message": "Session deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete session")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))
