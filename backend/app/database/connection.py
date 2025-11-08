"""
Database connection and session management
"""
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    create_async_engine,
    async_sessionmaker
)
from sqlalchemy.pool import NullPool, StaticPool
from app.config import settings
from app.database.models import Base
import logging

logger = logging.getLogger(__name__)

# Global engine instance
_engine: AsyncEngine = None
_session_maker: async_sessionmaker = None


def get_engine() -> AsyncEngine:
    """Get or create database engine"""
    global _engine
    
    if _engine is None:
        # Determine if using SQLite
        is_sqlite = settings.database_url.startswith("sqlite")
        
        if is_sqlite:
            # SQLite configuration
            _engine = create_async_engine(
                settings.database_url,
                echo=False,
                poolclass=StaticPool,
                connect_args={"check_same_thread": False}
            )
            logger.info(f"Created SQLite engine: {settings.database_url}")
        else:
            # PostgreSQL configuration
            _engine = create_async_engine(
                settings.database_url,
                echo=False,
                pool_size=5,
                max_overflow=10,
                pool_pre_ping=True
            )
            logger.info(f"Created PostgreSQL engine")
    
    return _engine


def get_session_maker() -> async_sessionmaker:
    """Get or create session maker"""
    global _session_maker
    
    if _session_maker is None:
        engine = get_engine()
        _session_maker = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False
        )
        logger.info("Created session maker")
    
    return _session_maker


async def init_db():
    """Initialize database tables"""
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session
    
    Usage:
        @app.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...
    """
    session_maker = get_session_maker()
    async with session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


async def close_db():
    """Close database connections"""
    global _engine
    if _engine:
        await _engine.dispose()
        logger.info("Database connections closed")
