#!/bin/bash

# Start the Spring Boot backend
echo "Starting Spring Boot backend..."
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start on port 9191..."
while ! nc -z localhost 9191 2>/dev/null; do
  sleep 1
done
echo "Backend started successfully!"

# Start the frontend
echo "Starting frontend..."
cd frontend
npm run dev

# When the frontend is stopped, also stop the backend
kill $BACKEND_PID