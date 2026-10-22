#!/bin/bash

echo "========================================"
echo "AI Collection Engine - Setup Script"
echo "========================================"
echo ""

echo "[1/5] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install root dependencies"
    exit 1
fi

echo ""
echo "[2/5] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "[3/5] Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "[4/5] Setting up environment files..."
cd ..
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env - Please configure your API keys"
fi
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "Created frontend/.env"
fi

echo ""
echo "[5/5] Initializing database..."
cd backend
npm run init-db
if [ $? -ne 0 ]; then
    echo "Error: Failed to initialize database"
    exit 1
fi

cd ..
echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure API keys in backend/.env"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm start"
echo ""
echo "Default login:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
