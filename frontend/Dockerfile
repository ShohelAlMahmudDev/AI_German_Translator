FROM node:18

WORKDIR /usr/src/app

# Verify build context contents
RUN ls -la /usr/src/app/

# Copy package files explicitly
COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install

# Copy application files
COPY ./frontend .

# Build and run
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]