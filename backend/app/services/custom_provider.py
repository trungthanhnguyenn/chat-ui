"""
Custom chatbot provider for SSE streaming endpoints
Supports custom endpoints with Server-Sent Events (SSE) format
"""
from typing import AsyncGenerator, List, Dict, Optional
import httpx
import json
from .base_provider import BaseChatbotProvider
import logging

logger = logging.getLogger(__name__)


class CustomChatbotProvider(BaseChatbotProvider):
    """Provider for custom SSE streaming endpoints"""
    
    def __init__(
        self,
        provider_id: str,
        name: str,
        base_url: str,
        endpoint: str,
        description: str = "Custom chatbot endpoint",
        timeout: float = 120.0
    ):
        """
        Initialize custom provider
        
        Args:
            provider_id: Unique identifier
            name: Display name
            base_url: Base URL (e.g., http://localhost:8004)
            endpoint: API endpoint (e.g., /v1/agent/finance/response_stream)
            description: Provider description
            timeout: Request timeout in seconds
        """
        super().__init__(provider_id, name, description)
        
        self.base_url = base_url.rstrip('/')
        self.endpoint = endpoint if endpoint.startswith('/') else f'/{endpoint}'
        self.full_url = f"{self.base_url}{self.endpoint}"
        self.timeout = timeout
        
        logger.info(f"Custom Provider initialized: {self.full_url}")
    
    async def chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion from custom endpoint
        
        Expected SSE format:
        data: {"delta": "token text"}
        data: [DONE]
        """
        try:
            # Extract last user message (custom endpoints typically don't need full history)
            last_message = messages[-1]['content'] if messages else ""
            
            logger.info(f"[{self.provider_id}] Starting stream to {self.full_url}")
            logger.debug(f"[{self.provider_id}] Question: {last_message}")
            
            # Configure timeout for streaming (2 minutes = 120 seconds)
            timeout = httpx.Timeout(self.timeout, connect=10.0)
            async with httpx.AsyncClient(timeout=timeout) as client:
                async with client.stream(
                    'POST',
                    self.full_url,
                    json={"question": last_message},
                    headers={
                        'accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                ) as response:
                    response.raise_for_status()
                    
                    chunk_count = 0
                    async for line in response.aiter_lines():
                        if not line or line.strip() == "":
                            continue
                        
                        # Parse SSE format: "data: {...}"
                        if line.startswith("data: "):
                            data_str = line[6:].strip()  # Remove "data: " prefix
                            
                            # Check for completion signal
                            if data_str == "[DONE]":
                                logger.info(f"[{self.provider_id}] Stream completed")
                                break
                            
                            try:
                                data = json.loads(data_str)
                                if "delta" in data:
                                    chunk_count += 1
                                    delta_text = data["delta"]
                                    logger.debug(f"[{self.provider_id}] Chunk {chunk_count}: {repr(delta_text)[:50]}")
                                    yield delta_text
                            except json.JSONDecodeError as e:
                                logger.warning(f"[{self.provider_id}] Failed to parse JSON: {data_str}")
                                continue
                    
                    logger.info(f"[{self.provider_id}] Stream finished. Total chunks: {chunk_count}")
            
        except httpx.HTTPStatusError as e:
            logger.error(f"[{self.provider_id}] HTTP error: {e.response.status_code}")
            yield f"\n\n[Error: HTTP {e.response.status_code}]"
        except httpx.TimeoutException:
            logger.error(f"[{self.provider_id}] Request timeout")
            yield "\n\n[Error: Request timeout]"
        except Exception as e:
            logger.error(f"[{self.provider_id}] Error in stream: {e}")
            yield f"\n\n[Error: {str(e)}]"
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> str:
        """
        Get complete chat completion (non-streaming)
        Collects all SSE chunks into a single response
        """
        try:
            full_response = ""
            async for chunk in self.chat_completion_stream(messages, **kwargs):
                full_response += chunk
            return full_response
        except Exception as e:
            logger.error(f"[{self.provider_id}] Error in completion: {e}")
            return f"Error: {str(e)}"
    
    def format_chat_history(
        self,
        history: List,
        system_prompt: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Custom endpoints typically only need the last message
        Override to customize behavior
        """
        # For custom endpoints, we typically just need the user's question
        # But we'll format it the same way for consistency
        return super().format_chat_history(history, system_prompt)
