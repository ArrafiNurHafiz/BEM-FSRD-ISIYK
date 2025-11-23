#!/bin/bash

# Production Build Script for Frontend
# This script builds the frontend for production deployment

echo "🏗️  Building BEM FSRD ISI Frontend for Production..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env file with default values..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo "⚠️  Please update .env file with production API URL!"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set NODE_ENV to production
export NODE_ENV=production

# Clean previous build
if [ -d "dist" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf dist
fi

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in: $(pwd)/dist"
    echo "📊 Build size:"
    du -sh dist
    
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy dist/ folder to your web server"
    echo "2. Configure web server to serve static files from dist/"
    echo "3. Configure reverse proxy for /api requests to backend"
else
    echo "❌ Build failed!"
    exit 1
fi

