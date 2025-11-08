"""
Chatbot Provider Registry
Manages multiple chatbot providers and allows easy switching
"""
from typing import Dict, List, Optional
from .base_provider import BaseChatbotProvider
from .openai_provider import OpenAIChatbotProvider
from .custom_provider import CustomChatbotProvider
from app.config import settings
import logging
import os
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger(__name__)


class ChatbotRegistry:
    """Registry for managing multiple chatbot providers"""
    
    def __init__(self):
        self.providers: Dict[str, BaseChatbotProvider] = {}
        self.default_provider_id: Optional[str] = None
        self._initialize_providers()
    
    def _initialize_providers(self):
        """Initialize all available providers from config"""
        logger.info("Initializing chatbot providers...")
        
        # 1. Initialize OpenAI/OpenRouter provider
        openai_provider = OpenAIChatbotProvider(
            provider_id="openai",
            name="OpenAI/OpenRouter",
            description=f"Using model: {settings.model_name}"
        )
        self.register_provider(openai_provider)
        self.default_provider_id = "openai"
        
        # 2. Initialize custom providers from environment variables
        self._load_custom_providers_from_env()
        
        logger.info(f"Initialized {len(self.providers)} providers: {list(self.providers.keys())}")
    
    def _load_custom_providers_from_env(self):
        """
        Load custom providers from environment variables
        Loads full config from /home/chaos/Documents/trung/project/chatbot-ui/backend/.env
        Looks for patterns like:
        ROUTE_CUSTOM_PORT_1=https://example.com/v1/agent/finance/response_stream (full URL)
        CUSTOM_NAME_1=Finance Agent (optional)
        CUSTOM_DESC_1=Financial analysis chatbot (optional)
        """
        from urllib.parse import urlparse
        
        # Load .env file explicitly from backend directory
        # Try multiple possible locations
        backend_dir = Path(__file__).parent.parent.parent  # Go up from app/services/ to backend/
        env_path = backend_dir / ".env"
        
        if not env_path.exists():
            # Fallback: try absolute path
            env_path = Path("/home/chaos/Documents/trung/project/chatbot-ui/backend/.env")
        
        if env_path.exists():
            load_dotenv(env_path, override=False)  # override=False: don't override existing env vars
            logger.info(f"Loaded .env file from: {env_path}")
        else:
            logger.warning(f".env file not found at: {env_path}, using system environment variables only")
        
        # Check for ROUTE_CUSTOM_PORT_* environment variables (full URLs)
        custom_routes = {}
        for key, value in os.environ.items():
            if key.startswith("ROUTE_CUSTOM_PORT_"):
                suffix = key.replace("ROUTE_CUSTOM_PORT_", "")
                # Remove quotes if present
                route_url = value.strip().strip('"').strip("'")
                if route_url:
                    custom_routes[suffix] = route_url
        
        # Create provider for each custom route
        for suffix, full_url in custom_routes.items():
            try:
                # Parse URL to extract base_url and endpoint
                parsed = urlparse(full_url)
                base_url = f"{parsed.scheme}://{parsed.netloc}"
                endpoint = parsed.path
                if parsed.query:
                    endpoint += f"?{parsed.query}"
                
                # Optional: custom name and description
                name = os.getenv(f"CUSTOM_NAME_{suffix}", f"Custom Agent {suffix}")
                description = os.getenv(f"CUSTOM_DESC_{suffix}", f"Custom chatbot at {full_url}")
                
                # Optional: custom timeout (default: 120 seconds = 2 minutes)
                timeout_str = os.getenv(f"CUSTOM_TIMEOUT_{suffix}")
                timeout = float(timeout_str) if timeout_str else 120.0
                
                provider_id = f"custom_{suffix.lower()}"
                
                custom_provider = CustomChatbotProvider(
                    provider_id=provider_id,
                    name=name,
                    base_url=base_url,
                    endpoint=endpoint,
                    description=description,
                    timeout=timeout
                )
                self.register_provider(custom_provider)
                logger.info(f"Loaded custom provider: {provider_id} at {full_url}")
            except Exception as e:
                logger.error(f"Failed to initialize custom provider {suffix}: {e}")
    
    def register_provider(self, provider: BaseChatbotProvider):
        """Register a new chatbot provider"""
        self.providers[provider.provider_id] = provider
        logger.info(f"Registered provider: {provider.provider_id} ({provider.name})")
    
    def get_provider(self, provider_id: Optional[str] = None) -> BaseChatbotProvider:
        """
        Get a provider by ID, or return default
        
        Args:
            provider_id: Provider identifier, or None for default
            
        Returns:
            BaseChatbotProvider instance
            
        Raises:
            ValueError: If provider_id not found
        """
        if provider_id is None:
            provider_id = self.default_provider_id
        
        if provider_id not in self.providers:
            available = ", ".join(self.providers.keys())
            raise ValueError(f"Provider '{provider_id}' not found. Available: {available}")
        
        return self.providers[provider_id]
    
    def list_providers(self) -> List[Dict]:
        """Get list of all available providers with their info"""
        return [provider.get_info() for provider in self.providers.values()]
    
    def set_default(self, provider_id: str):
        """Set default provider"""
        if provider_id not in self.providers:
            raise ValueError(f"Provider '{provider_id}' not found")
        self.default_provider_id = provider_id
        logger.info(f"Default provider set to: {provider_id}")


# Global registry instance
_registry: Optional[ChatbotRegistry] = None


def get_chatbot_registry() -> ChatbotRegistry:
    """Get the global chatbot registry (singleton)"""
    global _registry
    if _registry is None:
        _registry = ChatbotRegistry()
    return _registry


def get_provider(provider_id: Optional[str] = None) -> BaseChatbotProvider:
    """Convenience function to get a provider"""
    return get_chatbot_registry().get_provider(provider_id)
