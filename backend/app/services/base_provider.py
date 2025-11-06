"""
Base class for chatbot providers
Allows easy integration of multiple chatbot backends
"""
from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional, List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BaseChatbotProvider(ABC):
    """Abstract base class for chatbot providers"""
    
    def __init__(self, provider_id: str, name: str, description: str = ""):
        """
        Initialize chatbot provider
        
        Args:
            provider_id: Unique identifier for this provider
            name: Display name for UI
            description: Description of this provider
        """
        self.provider_id = provider_id
        self.name = name
        self.description = description
        logger.info(f"Initialized chatbot provider: {name} ({provider_id})")
    
    @abstractmethod
    async def chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion from the provider
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            **kwargs: Additional provider-specific parameters
            
        Yields:
            Token strings from the model
        """
        pass
    
    @abstractmethod
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> str:
        """
        Get complete chat completion (non-streaming)
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            **kwargs: Additional provider-specific parameters
            
        Returns:
            Complete response string
        """
        pass
    
    def format_chat_history(
        self,
        history: List,
        system_prompt: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Format chat history for the provider
        Default implementation - can be overridden by subclasses
        
        Args:
            history: List of ChatMessage objects or dicts
            system_prompt: Optional system prompt to prepend
            
        Returns:
            Formatted messages list
        """
        messages = []
        
        # Add system prompt if provided
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        
        # Add history messages
        for msg in history:
            if isinstance(msg, dict):
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
            else:
                # Assume it's a ChatMessage object
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        return messages
    
    def get_info(self) -> Dict[str, Any]:
        """Get provider information for UI"""
        return {
            "provider_id": self.provider_id,
            "name": self.name,
            "description": self.description
        }
