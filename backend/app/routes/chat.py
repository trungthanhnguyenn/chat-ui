"""
Chat routes for REST API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services import get_llm_service, MemoryService
from app.models import ChatRequest, ChatResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat_completion(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Get chat completion (non-streaming)
    
    Args:
        request: ChatRequest with message, user_id, and session_id
        
    Returns:
        ChatResponse with assistant's response
    """
    try:
        llm_service = get_llm_service()
        memory_service = MemoryService(db)
        
        # Get conversation history
        history = await memory_service.get_history(
            user_id=request.user_id,
            session_id=request.session_id,
            limit=20
        )
        
        # Format messages for LLM
        messages = llm_service.format_chat_history(history)
        messages.append({"role": "user", "content": request.message})
        
        # Get completion
        response_text = await llm_service.chat_completion(
            messages=messages,
            model=request.model
        )
        
        # Save conversation
        await memory_service.save_conversation(
            user_id=request.user_id,
            session_id=request.session_id,
            user_message=request.message,
            assistant_message=response_text
        )
        
        return ChatResponse(
            message=response_text,
            user_id=request.user_id,
            session_id=request.session_id
        )
        
    except Exception as e:
        logger.error(f"Error in chat completion: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "chat"}
