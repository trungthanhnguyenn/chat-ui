"""
Memory Service for managing conversation history
Adapted from lumir_agentic memory management
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func
from datetime import datetime
from app.database.models import Conversation, SessionMetadata
import logging

logger = logging.getLogger(__name__)


class MemoryService:
    """Service for managing conversation memory"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def save_message(
        self,
        user_id: str,
        session_id: str,
        role: str,
        content: str
    ) -> bool:
        """
        Save a single message to database
        
        Args:
            user_id: User identifier
            session_id: Session identifier
            role: Message role ('user' or 'assistant')
            content: Message content
            
        Returns:
            True if successful
        """
        try:
            # Create conversation entry
            conversation = Conversation(
                user_id=user_id,
                session_id=session_id,
                role=role,
                content=content,
                timestamp=datetime.now()
            )
            
            self.db.add(conversation)
            
            # Update or create session metadata
            await self._update_session_metadata(user_id, session_id, content if role == "user" else None)
            
            await self.db.commit()
            logger.info(f"Saved message for user {user_id}, session {session_id}")
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error saving message: {e}")
            return False
    
    async def save_conversation(
        self,
        user_id: str,
        session_id: str,
        user_message: str,
        assistant_message: str
    ) -> bool:
        """
        Save both user and assistant messages
        
        Args:
            user_id: User identifier
            session_id: Session identifier
            user_message: User's message
            assistant_message: Assistant's response
            
        Returns:
            True if successful
        """
        try:
            # Save user message
            user_conv = Conversation(
                user_id=user_id,
                session_id=session_id,
                role="user",
                content=user_message,
                timestamp=datetime.now()
            )
            
            # Save assistant message
            assistant_conv = Conversation(
                user_id=user_id,
                session_id=session_id,
                role="assistant",
                content=assistant_message,
                timestamp=datetime.now()
            )
            
            self.db.add(user_conv)
            self.db.add(assistant_conv)
            
            # Update session metadata
            await self._update_session_metadata(user_id, session_id, user_message)
            
            await self.db.commit()
            logger.info(f"Saved conversation for user {user_id}, session {session_id}")
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error saving conversation: {e}")
            return False
    
    async def get_history(
        self,
        user_id: str,
        session_id: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history
        
        Args:
            user_id: User identifier
            session_id: Session identifier
            limit: Maximum number of messages to retrieve
            
        Returns:
            List of message dictionaries
        """
        try:
            query = select(Conversation).where(
                and_(
                    Conversation.user_id == user_id,
                    Conversation.session_id == session_id
                )
            ).order_by(Conversation.timestamp.asc()).limit(limit)
            
            result = await self.db.execute(query)
            conversations = result.scalars().all()
            
            messages = [
                {
                    "role": conv.role,
                    "content": conv.content,
                    "timestamp": conv.timestamp.isoformat() if conv.timestamp else None
                }
                for conv in conversations
            ]
            
            logger.info(f"Retrieved {len(messages)} messages for session {session_id}")
            return messages
            
        except Exception as e:
            logger.error(f"Error getting history: {e}")
            return []
    
    async def get_user_sessions(
        self,
        user_id: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Get all sessions for a user
        
        Args:
            user_id: User identifier
            limit: Maximum number of sessions to retrieve
            
        Returns:
            List of session info dictionaries
        """
        try:
            query = select(SessionMetadata).where(
                SessionMetadata.user_id == user_id
            ).order_by(desc(SessionMetadata.updated_at)).limit(limit)
            
            result = await self.db.execute(query)
            sessions = result.scalars().all()
            
            return [session.to_dict() for session in sessions]
            
        except Exception as e:
            logger.error(f"Error getting user sessions: {e}")
            return []
    
    async def delete_session(
        self,
        user_id: str,
        session_id: str
    ) -> bool:
        """
        Delete a conversation session
        
        Args:
            user_id: User identifier
            session_id: Session identifier
            
        Returns:
            True if successful
        """
        try:
            # Delete conversations
            from sqlalchemy import delete
            
            stmt = delete(Conversation).where(
                and_(
                    Conversation.user_id == user_id,
                    Conversation.session_id == session_id
                )
            )
            await self.db.execute(stmt)
            
            # Delete metadata
            stmt = delete(SessionMetadata).where(
                and_(
                    SessionMetadata.user_id == user_id,
                    SessionMetadata.session_id == session_id
                )
            )
            await self.db.execute(stmt)
            
            await self.db.commit()
            logger.info(f"Deleted session {session_id} for user {user_id}")
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting session: {e}")
            return False
    
    async def _update_session_metadata(
        self,
        user_id: str,
        session_id: str,
        first_message: Optional[str] = None
    ):
        """Update or create session metadata"""
        try:
            # Check if metadata exists
            query = select(SessionMetadata).where(
                and_(
                    SessionMetadata.user_id == user_id,
                    SessionMetadata.session_id == session_id
                )
            )
            result = await self.db.execute(query)
            metadata = result.scalar_one_or_none()
            
            if metadata:
                # Update existing
                metadata.updated_at = datetime.now()
                metadata.message_count += 1
            else:
                # Create new
                title = first_message[:50] + "..." if first_message and len(first_message) > 50 else first_message or "New Conversation"
                metadata = SessionMetadata(
                    user_id=user_id,
                    session_id=session_id,
                    title=title,
                    message_count=1
                )
                self.db.add(metadata)
            
        except Exception as e:
            logger.error(f"Error updating session metadata: {e}")
