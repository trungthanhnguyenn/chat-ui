"""
LLM Service for interacting with OpenRouter API
"""
import asyncio
from typing import AsyncGenerator, Optional
from openai import AsyncOpenAI
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class LLMService:
    """Service for LLM interactions via OpenRouter"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None
    ):
        self.api_key = api_key or settings.openai_api_key
        self.base_url = base_url or settings.openai_base_url
        self.model = model or settings.model_name
        
        self.client = AsyncOpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )
        
        logger.info(f"LLM Service initialized with model: {self.model}")
    
    async def chat_completion_stream(
        self,
        messages: list,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion from LLM
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model name (optional, uses default if not provided)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Yields:
            Token strings from the model
        """
        try:
            model_to_use = model or self.model
            
            logger.info(f"Starting chat completion stream with model: {model_to_use}")
            logger.debug(f"Messages: {messages}")
            
            response = await self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )
            
            chunk_count = 0
            async for chunk in response:
                chunk_count += 1
                logger.debug(f"[LLM] Received chunk {chunk_count}: {chunk}")
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if hasattr(delta, 'content') and delta.content:
                        logger.debug(f"[LLM] Yielding content: {repr(delta.content)[:50]}")
                        yield delta.content
                    else:
                        logger.debug(f"[LLM] Chunk {chunk_count} has no content")
                else:
                    logger.debug(f"[LLM] Chunk {chunk_count} has no choices")
            
            logger.info(f"Chat completion stream finished. Total chunks: {chunk_count}")
            
        except Exception as e:
            logger.error(f"Error in chat completion stream: {e}")
            yield f"\n\n[Error: {str(e)}]"
    
    async def chat_completion(
        self,
        messages: list,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Get complete chat completion (non-streaming)
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model name (optional, uses default if not provided)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Complete response string
        """
        try:
            model_to_use = model or self.model
            
            logger.info(f"Getting chat completion with model: {model_to_use}")
            
            response = await self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )
            
            if response.choices and len(response.choices) > 0:
                content = response.choices[0].message.content
                logger.info("Chat completion finished")
                return content
            else:
                logger.warning("No response from model")
                return ""
            
        except Exception as e:
            logger.error(f"Error in chat completion: {e}")
            return f"Error: {str(e)}"
    
    def format_chat_history(
        self,
        history: list,
        system_prompt: Optional[str] = None
    ) -> list:
        """
        Format chat history for LLM API
        
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
                # Assume it's a Pydantic model
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        return messages


# Global LLM service instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Get or create global LLM service instance"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
