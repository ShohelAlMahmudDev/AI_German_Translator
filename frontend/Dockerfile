FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy and build
COPY . .
RUN npm run build

# Install lightweight server
RUN npm install -g serve

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"]