# Chatbot UI Backend

Backend API for React Chatbot UI with WebSocket streaming support.

## Features

- ✅ FastAPI with async support
- ✅ WebSocket for real-time streaming
- ✅ SQLAlchemy for database management
- ✅ OpenRouter API integration
- ✅ Conversation history persistence
- ✅ Session management

## Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your OpenRouter API key
```

4. Run the server:
```bash
python -m app.main
```

Or with uvicorn:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## API Endpoints

### REST API

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /chat/` - Chat completion (non-streaming)
- `POST /history/get` - Get conversation history
- `POST /history/save` - Save conversation
- `GET /history/sessions/{user_id}` - Get user sessions
- `DELETE /history/session/{user_id}/{session_id}` - Delete session

### WebSocket

- `WS /ws/{client_id}` - WebSocket endpoint for streaming chat

#### WebSocket Message Format

**Send (Client → Server):**
```json
{
  "type": "chat",
  "data": {
    "message": "Your question here",
    "user_id": "user_123",
    "session_id": "session_456",
    "model": "openai/gpt-4-turbo-preview"
  }
}
```

**Receive (Server → Client):**
```json
// Stream start
{"type": "stream_start", "data": {}}

// Stream chunks
{"type": "stream_chunk", "data": {"chunk": "token"}}

// Stream end
{"type": "stream_end", "data": {"full_response": "complete response"}}

// Error
{"type": "error", "data": {"error": "error message"}}
```

## Database

Uses SQLite by default. To use PostgreSQL:

1. Update `.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/chatbot
```

2. Ensure PostgreSQL is running

## Development

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── models/              # Pydantic models
│   ├── database/            # Database models & connection
│   ├── services/            # Business logic
│   └── routes/              # API routes
├── requirements.txt
└── .env.example
```

### Testing

```bash
# Test health endpoint
curl http://localhost:8001/health

# Test chat endpoint
curl -X POST http://localhost:8001/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "user_id": "test_user",
    "session_id": "test_session"
  }'
```

## Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc
