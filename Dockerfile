# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and configuration
COPY . .

# Build application
RUN npm run build

# -------------------------------------------------------------
# Production runner image
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html

EXPOSE 3000

USER node

CMD ["npm", "run", "dev"]
