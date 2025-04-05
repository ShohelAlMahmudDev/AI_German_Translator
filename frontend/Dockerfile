FROM node:18
WORKDIR /app
# Copy package files first (optimizes layer caching)
COPY package*.json ./
RUN npm install
# Copy all other files
COPY . .
# Build and run commands
RUN npm run build
CMD ["npm", "start"]