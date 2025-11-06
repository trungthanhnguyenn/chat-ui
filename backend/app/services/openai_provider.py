"""
OpenAI-compatible chatbot provider
Wraps the existing LLMService for OpenAI/OpenRouter
"""
from typing import AsyncGenerator, Optional, List, Dict
from openai import AsyncOpenAI
from app.config import settings
from .base_provider import BaseChatbotProvider
import logging

logger = logging.getLogger(__name__)


class OpenAIChatbotProvider(BaseChatbotProvider):
    """Provider for OpenAI-compatible APIs (OpenAI, OpenRouter, etc.)"""
    
    def __init__(
        self,
        provider_id: str = "openai",
        name: str = "OpenAI",
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        description: str = "OpenAI/OpenRouter API"
    ):
        super().__init__(provider_id, name, description)
        
        self.api_key = api_key or settings.openai_api_key
        self.base_url = base_url or settings.openai_base_url
        self.model = model or settings.model_name
        
        self.client = AsyncOpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )
        
        logger.info(f"OpenAI Provider initialized with model: {self.model}")
    
    async def chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """Stream chat completion from OpenAI API"""
        try:
            model_to_use = model or self.model
            
            logger.info(f"[{self.provider_id}] Starting stream with model: {model_to_use}")
            logger.debug(f"[{self.provider_id}] Messages: {messages}")
            
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
                logger.debug(f"[{self.provider_id}] Chunk {chunk_count}: {chunk}")
                
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if hasattr(delta, 'content') and delta.content:
                        logger.debug(f"[{self.provider_id}] Yielding: {repr(delta.content)[:50]}")
                        yield delta.content
            
            logger.info(f"[{self.provider_id}] Stream finished. Total chunks: {chunk_count}")
            
        except Exception as e:
            logger.error(f"[{self.provider_id}] Error in stream: {e}")
            yield f"\n\n[Error: {str(e)}]"
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> str:
        """Get complete chat completion (non-streaming)"""
        try:
            model_to_use = model or self.model
            
            logger.info(f"[{self.provider_id}] Getting completion with model: {model_to_use}")
            
            response = await self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )
            
            if response.choices and len(response.choices) > 0:
                content = response.choices[0].message.content
                logger.info(f"[{self.provider_id}] Completion finished")
                return content or ""
            else:
                logger.warning(f"[{self.provider_id}] No response from model")
                return ""
            
        except Exception as e:
            logger.error(f"[{self.provider_id}] Error in completion: {e}")
            return f"Error: {str(e)}"
