# Base Image
FROM node:22-alpine

# Working Directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Start application
CMD ["npm", "start"]