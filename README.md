# 🤖 Chatbot UI - Full-Stack LLM Application

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org/)

Full-stack chatbot application with React frontend and FastAPI backend, featuring real-time WebSocket streaming, persistent conversation history, multi-session management, and a modern ChatGPT-like UI.

---

## 📋 Features

- ✨ **Real-time Streaming**: WebSocket-based streaming for instant responses
- � **Multi-Provider Support**: Switch between OpenAI/OpenRouter and custom chatbot agents
- �💬 **Multi-Session Support**: Create and manage multiple conversation sessions
- 📚 **Persistent History**: SQLite/PostgreSQL database for conversation storage
- 🎨 **Modern UI**: ChatGPT-like interface with Tailwind CSS and provider selector
- 🔌 **OpenRouter Compatible**: Works with OpenAI, Gemini, Claude, and other LLM providers
- 🤖 **Custom Agent Integration**: Connect to your own SSE-based chatbot endpoints
- 🐳 **Docker Ready**: Easy deployment with Docker Compose
- 🧪 **Comprehensive Tests**: Backend, WebSocket, and UI automated tests
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔍 **Auto Provider Discovery**: Automatically detects available providers from environment variables

---

## 🏗️ Architecture

```
chatbot-ui/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── main.py      # Application entry point
│   │   ├── config.py    # Configuration management
│   │   ├── routes/      # API endpoints (chat, sessions, history, providers)
│   │   ├── services/    # Business logic (LLM, Memory, Providers)
│   │   │   ├── chatbot_registry.py  # Provider registry & auto-discovery
│   │   │   ├── openai_provider.py   # OpenAI/OpenRouter provider
│   │   │   └── custom_provider.py   # Custom SSE agent provider
│   │   ├── models/      # Pydantic schemas
│   │   └── database/    # SQLAlchemy models and session
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Chat/    # Chat UI components + ProviderSelector
│   │   │   ├── Sidebar/ # Sidebar and conversation list
│   │   │   └── Common/  # Shared components
│   │   ├── contexts/    # State management (Chat, WebSocket)
│   │   ├── services/    # API and WebSocket clients
│   │   └── utils/       # Helper functions
│   ├── Dockerfile
│   └── package.json
│
├── tests/                # Test Suite
│   ├── test_backend.py          # REST API tests
│   ├── test_websocket.py        # WebSocket streaming tests
│   ├── test_interactive.py      # CLI chat interface
│   ├── test_ui_selenium.py      # Automated UI tests
│   └── test_integration.sh      # Full integration test script
│
├── docs/                 # Documentation
│   ├── QUICK_START.md           # Quick start guide
│   ├── MULTI_PROVIDER_SYSTEM.md # Multi-provider architecture
│   ├── PROVIDER_QUICK_START.md  # Provider setup guide
│   ├── DEPLOYMENT.md            # Production deployment guide
│   ├── IMPLEMENTATION_PLAN.md   # Detailed implementation plan
│   └── PROJECT_STRUCTURE.md     # Architecture documentation
│
└── docker-compose.yml    # Docker orchestration
```

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone repository
cd /home/chaos/Documents/trung/project/chatbot-ui

# Run integration test (installs dependencies and starts services)
cd tests
chmod +x test_integration.sh
./test_integration.sh
```

This will:
- Install all dependencies
- Start backend on http://localhost:8001
- Start frontend on http://localhost:5173
- Run health checks
- Keep services running until Ctrl+C

### Option 2: Docker Compose

```bash
# Start both services
docker-compose up

# Stop services
docker-compose down
```

### Option 3: Manual Setup

#### Backend

```bash
cd backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # Add your API keys and configure providers

# Example .env configuration:
# OPENAI_API_KEY=your-key-here
# OPENAI_BASE_URL=https://openrouter.ai/api/v1
# MODEL_NAME=openai/gpt-4-turbo-preview
# CUSTOM_PORT_1=8004  # Optional: for custom agents
# ROUTE_CUSTOM_PORT_1=/v1/agent/finance/response_stream

# Start server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

---

## 📖 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Multi-Provider System](docs/MULTI_PROVIDER_SYSTEM.md)** - Provider architecture and setup
- **[Provider Quick Start](docs/PROVIDER_QUICK_START.md)** - Configure OpenAI and custom agents
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** - Detailed technical design
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Architecture documentation
- **[Test Guide](tests/README.md)** - Running and writing tests

---

## 🧪 Testing

### Backend Tests

```bash
cd tests

# Install test dependencies
pip install -r requirements.txt

# Run all backend tests
python test_backend.py

# Test WebSocket streaming
python test_websocket.py

# Interactive CLI chat
python test_interactive.py
```

### Frontend Tests

```bash
# Automated UI tests (requires Chrome)
python test_ui_selenium.py

# Browser WebSocket test
open tests/test_websocket.html
```

### Full Integration Test

```bash
cd tests
./test_integration.sh
```

---

## 📝 Implementation Status

### ✅ Backend (Complete)
- [x] FastAPI application with async support
- [x] SQLAlchemy models for sessions and conversations
- [x] Memory service with persistent storage
- [x] LLM service with OpenRouter/Gemini integration
- [x] WebSocket streaming endpoint
- [x] REST API endpoints (chat, sessions, history)
- [x] CORS configuration for cross-origin requests
- [x] Comprehensive error handling
- [x] Structured logging
- [x] Health check endpoint
- [x] Docker support

### ✅ Frontend (Complete)
- [x] React 18+ with Vite build tool
- [x] Tailwind CSS for styling
- [x] Context API for state management
- [x] WebSocket client for real-time streaming
- [x] Chat UI components (message list, input, header)
- [x] Sidebar with conversation history
- [x] Session management UI
- [x] Error boundaries and loading states
- [x] Markdown rendering for messages
- [x] Code syntax highlighting
- [x] Responsive design
- [x] Docker support

### ✅ Testing (Complete)
- [x] Backend API tests
- [x] WebSocket streaming tests
- [x] Interactive CLI test
- [x] Automated UI tests with Selenium
- [x] Integration test script
- [x] Browser-based WebSocket test


### ⏳ Next Steps (Optional Enhancements)

- [ ] User authentication and authorization
- [ ] Model selection UI (switch between GPT-4, Claude, Gemini)
- [ ] Conversation export/import (JSON, Markdown)
- [ ] File upload support
- [ ] Image generation support
- [ ] Voice input/output
- [ ] Collaborative sessions
- [ ] Advanced prompt templates
- [ ] Rate limiting and usage tracking
- [ ] Admin dashboard

---

## 🌐 Accessing the Application

Once running, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Alternative Docs**: http://localhost:8001/redoc
- **Health Check**: http://localhost:8001/health

---

## 🔧 Configuration

### Backend (.env)

```bash
# API Configuration
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api2.key4u.shop/v1
MODEL_NAME=gemini-2.0-flash-lite

# Server
HOST=0.0.0.0
PORT=8001
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Database
DATABASE_URL=sqlite+aiosqlite:///./chatbot.db
# For PostgreSQL:
# DATABASE_URL=postgresql+asyncpg://user:pass@localhost/dbname

# Security
SECRET_KEY=your-secret-key-change-in-production

# Logging
LOG_LEVEL=INFO
```

### Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:8001
```

---

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PORT=8001
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
    restart: unless-stopped
```

---

## 🛠️ Development

### Project Structure

```
chatbot-ui/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py         # Chat endpoints
│   │   │   ├── sessions.py     # Session management
│   │   │   └── history.py      # Conversation history
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── llm.py          # LLM integration
│   │   │   └── memory.py       # Memory management
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py      # Pydantic models
│   │   └── database/
│   │       ├── __init__.py
│   │       ├── models.py       # SQLAlchemy models
│   │       └── session.py      # Database session
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatContainer.jsx
│   │   │   │   ├── ChatHeader.jsx
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   └── ChatInput.jsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   └── NewChatButton.jsx
│   │   │   └── Common/
│   │   │       ├── Loading.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   ├── contexts/
│   │   │   ├── ChatContext.jsx
│   │   │   └── WebSocketContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── websocket.js
│   │   ├── utils/
│   │   │   ├── storage.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env
│
├── tests/
│   ├── test_backend.py
│   ├── test_websocket.py
│   ├── test_interactive.py
│   ├── test_ui_selenium.py
│   ├── test_websocket.html
│   ├── test_integration.sh
│   └── requirements.txt
│
├── docs/
│   ├── QUICK_START.md
│   ├── DEPLOYMENT.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── PROJECT_STRUCTURE.md
│
├── docker-compose.yml
├── setup.sh
├── requirements.txt
├── .gitignore
└── README.md
```

### Adding New Features

#### Add a new API endpoint:

1. Create route in `backend/app/routes/`
2. Add service logic in `backend/app/services/`
3. Update Pydantic models if needed in `backend/app/models/`

#### Add a new React component:

1. Create component in `frontend/src/components/`
2. Import and use in parent component
3. Add to context if state management needed

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- FastAPI for the awesome backend framework
- React team for the frontend library
- Tailwind CSS for the utility-first styling
- OpenRouter for LLM API aggregation

---

## 📞 Support

For issues, questions, or contributions:

- Create an issue on GitHub
- Check existing documentation in `/docs`
- Review test examples in `/tests`
- Check API docs at http://localhost:8001/docs

---

## 🔗 Related Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

    command: npm run dev -- --host
```

Run with:
```bash
docker-compose up -d
```

---

## 📚 Documentation

Full API documentation available at: `http://localhost:8001/docs`

For detailed guides, see:
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) - Complete implementation plan
- [`docs/SUMMARY.md`](docs/SUMMARY.md) - Current implementation status
- [`backend/README.md`](backend/README.md) - Backend API documentation
- [`tests/README.md`](tests/README.md) - Testing guide

### Key Endpoints:

**WebSocket:**
- `WS /ws/{client_id}` - Real-time chat streaming

**REST API:**
- `POST /chat/` - Non-streaming chat
- `POST /history/get` - Get conversation history
- `POST /history/save` - Save conversation
- `GET /history/sessions/{user_id}` - Get user sessions
- `DELETE /history/session/{user_id}/{session_id}` - Delete session

---

## 🎨 UI Features

- ✅ Real-time message streaming
- ✅ Conversation history sidebar
- ✅ Multiple conversation support
- ✅ Dark/Light theme toggle
- ✅ Markdown rendering
- ✅ Code syntax highlighting
- ✅ Copy message button
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

---

## 🔧 Troubleshooting

### Backend Issues

**Import errors:** Run `pip install -r requirements.txt`
**Database errors:** Delete `chatbot.db` and restart
**CORS errors:** Check `CORS_ORIGINS` in `.env`

### Frontend Issues

**Dependencies:** Run `npm install`
**WebSocket connection:** Check `VITE_WS_URL` in `.env`
**Build errors:** Clear `node_modules` and reinstall

---

## 📞 Support

For issues or questions, please check:
1. Implementation plan: `IMPLEMENTATION_PLAN.md`
2. Backend README: `backend/README.md`
3. API Documentation: `http://localhost:8001/docs`

---

**Status**: Backend Complete ✅ | Frontend In Progress ⏳

**Next**: Complete React components and contexts
