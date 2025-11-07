"""
Configuration management for the chatbot API
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    openai_api_key: str = ""
    openai_base_url: str = "https://openrouter.ai/api/v1"
    model_name: str = "openai/gpt-4-turbo-preview"
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./chatbot.db"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8001
    cors_origins: str = '["http://localhost:5173","http://localhost:3000","https://*.trycloudflare.com"]'
    
    # Security
    secret_key: str = "change-me-in-production"
    ttl: int = 864000  # 10 days
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"  # Allow extra fields from .env (for custom providers)

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string"""
        import json
        try:
            return json.loads(self.cors_origins)
        except:
            return ["http://localhost:5173", "http://localhost:3000"]


# Global settings instance
settings = Settings()
