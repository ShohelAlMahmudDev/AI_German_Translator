FROM node:18-alpine AS builder

WORKDIR /app

# First copy only package files for better caching
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy all source files
COPY . .

# Build production assets
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/build ./build

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]