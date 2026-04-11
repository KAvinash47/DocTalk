# Multi-stage Dockerfile for DocTalk Full-Stack

# Stage 1: Build Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set base URL for API in production if needed
ENV VITE_API_URL=http://localhost:5001
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Copy built frontend
COPY --from=build-frontend /app/dist ./public

# Copy backend
COPY --from=build-backend /app/backend ./backend

# Install production dependencies for the root if needed
# For this project, the backend is self-contained.

# Install a simple static server or use the backend to serve the frontend
# To keep it simple, we'll update backend/server.js to serve static files.

EXPOSE 5001
CMD ["node", "backend/server.js"]
