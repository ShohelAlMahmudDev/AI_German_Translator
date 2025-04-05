FROM node:18-alpine

WORKDIR /app

# Verify build context contents (debugging)
RUN ls -la /app/

# Copy package files from host to container
COPY ./package.json ./package-lock.json ./
RUN npm install --omit=dev

# Copy all other files
COPY . .

# Build production assets
RUN npm run build

# Install serve for production
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]