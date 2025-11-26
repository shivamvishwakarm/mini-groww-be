# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY --from=builder /usr/local/bin/entrypoint.sh /usr/local/bin/entrypoint.sh

# Expose port
EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start server
CMD ["node", "dist/server.js"]
