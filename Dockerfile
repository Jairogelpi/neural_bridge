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

# Start server
CMD ["tsx", "src/server.ts"]
