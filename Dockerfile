# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║     NEURAL BRIDGE - DOCKER PRODUCTION IMAGE                                  ║
# ║     ALL 4 REVOLUTIONARY FEATURES - 100% REAL - UNIVERSAL                     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm install -g tsx

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/health || exit 1

# Start server
CMD ["tsx", "src/server.ts"]
