"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import sys

from app.config import settings
from app.database import init_db, close_db
from app.routes import chat_router, history_router, websocket_router
from app.routes.providers import router as providers_router
from app.services import get_chatbot_registry

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Chatbot UI Backend...")
    logger.info(f"Model: {settings.model_name}")
    logger.info(f"Base URL: {settings.openai_base_url}")
    
    # Initialize chatbot providers registry
    registry = get_chatbot_registry()
    providers = registry.list_providers()
    logger.info(f"Initialized {len(providers)} chatbot providers:")
    for p in providers:
        logger.info(f"  - {p['provider_id']}: {p['name']}")
    
    # Initialize database
    await init_db()
    logger.info("Database initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    await close_db()
    logger.info("Database connections closed")


# Create FastAPI app
app = FastAPI(
    title="Chatbot UI API",
    description="Backend API for React Chatbot UI with streaming support",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
# Allow all origins for cloudflare tunnel support
# In production, you should restrict this to specific domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for cloudflare tunnel
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)
app.include_router(history_router)
app.include_router(websocket_router)
app.include_router(providers_router, prefix="/api", tags=["providers"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Chatbot UI API",
        "version": "1.0.0",
        "docs": "/docs",
        "websocket": "/ws/{client_id}"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": settings.model_name,
        "api_url": settings.openai_base_url
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
        log_level=settings.log_level.lower()
    )
