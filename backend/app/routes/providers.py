"""
Providers API routes
"""
from fastapi import APIRouter
from app.services import get_chatbot_registry
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/providers")
async def list_providers():
    """
    List all available chatbot providers
    
    Returns:
        {
            "success": true,
            "providers": [
                {
                    "provider_id": "openai",
                    "name": "OpenAI/OpenRouter",
                    "description": "Using model: gpt-4"
                },
                ...
            ],
            "default": "openai"
        }
    """
    try:
        registry = get_chatbot_registry()
        providers = registry.list_providers()
        
        return {
            "success": True,
            "providers": providers,
            "default": registry.default_provider_id
        }
    except Exception as e:
        logger.error(f"Error listing providers: {e}")
        return {
            "success": False,
            "error": str(e),
            "providers": []
        }


@router.get("/providers/{provider_id}")
async def get_provider_info(provider_id: str):
    """Get information about a specific provider"""
    try:
        registry = get_chatbot_registry()
        provider = registry.get_provider(provider_id)
        
        return {
            "success": True,
            "provider": provider.get_info()
        }
    except ValueError as e:
        return {
            "success": False,
            "error": str(e)
        }
    except Exception as e:
        logger.error(f"Error getting provider {provider_id}: {e}")
        return {
            "success": False,
            "error": str(e)
        }
