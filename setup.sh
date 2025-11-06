#!/bin/bash

echo "🤖 Chatbot UI Setup Script"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your OpenRouter API key!"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || . venv/Scripts/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy .env if needed
if [ ! -f .env ]; then
    cp .env.example .env
fi

cd ..

echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

# Copy .env if needed
if [ ! -f .env ]; then
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Option 1 - Separate terminals:"
echo "  Terminal 1: cd backend && source venv/bin/activate && python -m app.main"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Option 2 - Docker:"
echo "  docker-compose up -d"
echo ""
echo "📚 Documentation:"
echo "  - Main README: README.md"
echo "  - Backend API: http://localhost:8001/docs"
echo "  - Frontend: http://localhost:5173"
echo ""
