#!/bin/bash
# Run Vite dev server with cloudflare tunnel backend API

echo "Starting Vite with cloudflare tunnel backend..."
echo "Backend: https://bite-oldest-sign-lucky.trycloudflare.com"

# Copy cloudflare env file
cp .env.cloudflare .env

# Start Vite
npm run dev
