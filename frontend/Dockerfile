FROM node:18-alpine

# Set working directory INSIDE container
WORKDIR /usr/src/app

# Debug: Show initial directory contents
RUN ls -la /usr/src/app/

# Copy package files explicitly from HOST to CONTAINER
COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install --omit=dev

# Copy all other files
COPY ./frontend .

# Build production assets
RUN npm run build

# Install production server
RUN npm install -g serve

EXPOSE 8000
CMD ["serve", "-s", "build", "-l", "8000"]