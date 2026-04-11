# Dockerfile optimized for Render Backend
FROM node:20-alpine

WORKDIR /app

# Copy backend dependencies first
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source code
COPY backend/ ./backend/

# Copy public data (required for doctors.json)
COPY public/ ./public/

EXPOSE 5001

# Command to run the backend
CMD ["node", "backend/server.js"]
