#!/bin/bash

# Start Local Soul Engine with 3D Visualization
echo "🚀 Starting Professor Code's 3D Soul Visualization with Local Engine..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

if ! command_exists npx; then
    echo -e "${RED}❌ npx is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites satisfied${NC}"

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up background processes...${NC}"
    jobs -p | xargs -r kill
    exit 0
}

# Set up signal handlers for clean shutdown
trap cleanup SIGINT SIGTERM

# Start the local soul engine development server
echo -e "${BLUE}🔧 Starting standalone local soul server...${NC}"
npm install --no-save ws express cors
node local-soul-server.js > soul-engine.log 2>&1 &
SOUL_ENGINE_PID=$!

echo -e "${GREEN}✅ Soul server started (PID: $SOUL_ENGINE_PID)${NC}"

# Wait a moment for the soul server to initialize
echo -e "${YELLOW}⏳ Waiting for soul server to initialize...${NC}"
sleep 3

# Start the 3D visualization
echo -e "${BLUE}🎨 Starting 3D visualization...${NC}"
npm run soul-3d:dev &
VITE_PID=$!

echo -e "${GREEN}✅ 3D visualization started (PID: $VITE_PID)${NC}"

# Display status
echo -e "\n${GREEN}🌟 Professor Code's 3D Soul is now running!${NC}"
echo -e "${BLUE}📊 Soul Server:${NC} Running locally on port 4000"
echo -e "${BLUE}🎨 3D Visualization:${NC} http://localhost:3000"
echo -e "${BLUE}📝 Soul Server Logs:${NC} soul-engine.log"

echo -e "\n${YELLOW}💡 Usage:${NC}"
echo -e "  - Open http://localhost:3000 in your browser"
echo -e "  - Chat with Professor Code in the 3D interface"
echo -e "  - Watch the soul's cognitive processes in real-time"
echo -e "  - Enable voice synthesis for spoken responses"

echo -e "\n${YELLOW}🔧 To stop:${NC} Press Ctrl+C"

# Wait for background processes
wait 