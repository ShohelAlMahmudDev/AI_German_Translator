FROM node:18

WORKDIR /app

# First copy only package files for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy all other files
COPY . .

# Build the app
RUN npm run build

# Install serve for production
RUN npm install -g serve

# Expose port and run
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]