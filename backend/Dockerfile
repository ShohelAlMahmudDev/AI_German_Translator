FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev  # Saves significant memory

# Copy and build
COPY . .
RUN npm run build

# Install lightweight server
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]  # Serve static files