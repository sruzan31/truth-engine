#!/bin/bash
# ================================================================
# The Truth Engine - One-Command Startup Script
# ================================================================
# Usage: ./start.sh
# This script starts both the FastAPI backend and Next.js frontend
# ================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ████████╗██████╗ ██╗   ██╗████████╗██╗  ██╗"
echo "     ██╔══╝██╔══██╗██║   ██║╚══██╔══╝██║  ██║"
echo "     ██║   ██████╔╝██║   ██║   ██║   ███████║"
echo "     ██║   ██╔══██╗██║   ██║   ██║   ██╔══██║"
echo "     ██║   ██║  ██║╚██████╔╝   ██║   ██║  ██║"
echo "     ╚═╝   ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝"
echo "   ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗"
echo "   ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝"
echo "   █████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗  "
echo "   ██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝  "
echo "   ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗"
echo "   ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝"
echo -e "${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${YELLOW}AI-Powered Digital Trust & Cybersecurity Platform${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Kill any existing processes on ports 8000 or 3000
echo -e "${YELLOW}► Cleaning up existing processes...${NC}"
lsof -ti:8000 | xargs kill -9 2>/dev/null && echo -e "  ${GREEN}✓${NC} Port 8000 cleared" || echo -e "  ${GREEN}✓${NC} Port 8000 was free"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo -e "  ${GREEN}✓${NC} Port 3000 cleared" || echo -e "  ${GREEN}✓${NC} Port 3000 was free"
sleep 1

# Start FastAPI Backend
echo ""
echo -e "${YELLOW}► Starting FastAPI Backend (port 8000)...${NC}"
cd "$SCRIPT_DIR"
"$SCRIPT_DIR/backend/venv/bin/uvicorn" backend.app.main:app \
  --host 127.0.0.1 \
  --port 8000 \
  --reload \
  --log-level info &
BACKEND_PID=$!

# Wait for backend to be ready
echo -e "  Waiting for backend to initialize..."
for i in {1..10}; do
  if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Backend online at http://127.0.0.1:8000"
    break
  fi
  sleep 1
done

# Start Next.js Frontend
echo ""
echo -e "${YELLOW}► Starting Next.js Frontend (port 3000)...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo -e "  Waiting for frontend to initialize..."
for i in {1..15}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Frontend online at http://localhost:3000"
    break
  fi
  sleep 1
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${GREEN}✓ The Truth Engine is running!${NC}"
echo ""
echo -e "  ${CYAN}→ Frontend:${NC}  http://localhost:3000"
echo -e "  ${CYAN}→ API Docs:${NC}  http://127.0.0.1:8000/docs"
echo -e "  ${CYAN}→ Health:${NC}    http://127.0.0.1:8000/health"
echo ""
echo -e "  Press ${YELLOW}Ctrl+C${NC} to stop both servers."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Open browser (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sleep 2
  open http://localhost:3000
fi

# Wait for interrupt
trap "echo ''; echo -e '${YELLOW}Shutting down...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
