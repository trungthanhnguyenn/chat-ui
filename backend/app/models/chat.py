"""
Pydantic models for API requests and responses
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class MessageRole:
    """Message role constants"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str = Field(..., description="Message role: user or assistant")
    content: str = Field(..., description="Message content")
    timestamp: Optional[datetime] = Field(default_factory=datetime.now)
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "Hello, how are you?",
                "timestamp": "2024-01-01T00:00:00"
            }
        }


class ChatRequest(BaseModel):
    """Chat request model"""
    message: str = Field(..., description="User message")
    user_id: str = Field(..., description="User identifier")
    session_id: str = Field(..., description="Session identifier")
    model: Optional[str] = Field(None, description="LLM model to use")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "What is the capital of France?",
                "user_id": "user_123",
                "session_id": "session_456",
                "model": "openai/gpt-4-turbo-preview"
            }
        }


class ChatResponse(BaseModel):
    """Chat response model"""
    message: str = Field(..., description="Assistant response")
    user_id: str = Field(..., description="User identifier")
    session_id: str = Field(..., description="Session identifier")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "The capital of France is Paris.",
                "user_id": "user_123",
                "session_id": "session_456",
                "timestamp": "2024-01-01T00:00:00"
            }
        }


class HistoryRequest(BaseModel):
    """History request model"""
    user_id: str = Field(..., description="User identifier")
    session_id: str = Field(..., description="Session identifier")
    limit: Optional[int] = Field(50, description="Maximum number of messages to retrieve")


class HistoryResponse(BaseModel):
    """History response model"""
    success: bool = Field(..., description="Operation success status")
    messages: List[ChatMessage] = Field(..., description="List of chat messages")
    count: int = Field(..., description="Total number of messages")


class SaveHistoryRequest(BaseModel):
    """Save history request model"""
    user_id: str = Field(..., description="User identifier")
    session_id: str = Field(..., description="Session identifier")
    user_message: str = Field(..., description="User message")
    assistant_message: str = Field(..., description="Assistant response")


class ConversationInfo(BaseModel):
    """Conversation information"""
    session_id: str = Field(..., description="Session identifier")
    title: Optional[str] = Field(None, description="Conversation title")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    message_count: int = Field(0, description="Number of messages")


class ConversationListResponse(BaseModel):
    """List of conversations response"""
    success: bool = Field(..., description="Operation success status")
    conversations: List[ConversationInfo] = Field(..., description="List of conversations")
    count: int = Field(..., description="Total number of conversations")


class WebSocketMessage(BaseModel):
    """WebSocket message format"""
    type: str = Field(..., description="Message type: chat, history, error, etc.")
    data: Dict[str, Any] = Field(..., description="Message data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "chat",
                "data": {
                    "message": "Hello",
                    "user_id": "user_123",
                    "session_id": "session_456"
                }
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(False, description="Operation success status")
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
