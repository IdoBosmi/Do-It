#!/bin/bash

# Build backend Docker image
echo "Building backend Docker image..."
docker build -t backend:latest ./backend

# Build frontend Docker image
echo "Building frontend Docker image..."
docker build -t frontend:latest ./frontend

# Run both containers
echo "Running backend container..."
docker run -d --name backend-container -p 5000:5000 backend:latest

echo "Running frontend container..."
docker run -d --name frontend-container -p 3000:3000 frontend:latest