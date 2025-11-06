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
        Looks for patterns like:
        CUSTOM_PORT_1=8004
        ROUTE_CUSTOM_PORT_1=/v1/agent/finance/response_stream
        CUSTOM_NAME_1=Finance Agent (optional)
        CUSTOM_DESC_1=Financial analysis chatbot (optional)
        """
        # Check for CUSTOM_PORT_* environment variables
        custom_ports = {}
        for key, value in os.environ.items():
            if key.startswith("CUSTOM_PORT_"):
                suffix = key.replace("CUSTOM_PORT_", "")
                custom_ports[suffix] = value
        
        # Create provider for each custom port
        for suffix, port in custom_ports.items():
            route_key = f"ROUTE_CUSTOM_PORT_{suffix}"
            route = os.getenv(route_key)
            
            if not route:
                logger.warning(f"Found {key} but no {route_key}, skipping")
                continue
            
            # Optional: custom name and description
            name = os.getenv(f"CUSTOM_NAME_{suffix}", f"Custom Agent {suffix}")
            description = os.getenv(f"CUSTOM_DESC_{suffix}", f"Custom chatbot on port {port}")
            
            # Determine base URL
            host = os.getenv(f"CUSTOM_HOST_{suffix}", "localhost")
            base_url = f"http://{host}:{port}"
            
            provider_id = f"custom_{suffix.lower()}"
            
            try:
                custom_provider = CustomChatbotProvider(
                    provider_id=provider_id,
                    name=name,
                    base_url=base_url,
                    endpoint=route,
                    description=description
                )
                self.register_provider(custom_provider)
                logger.info(f"Loaded custom provider: {provider_id} at {base_url}{route}")
            except Exception as e:
                logger.error(f"Failed to initialize custom provider {provider_id}: {e}")
    
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
