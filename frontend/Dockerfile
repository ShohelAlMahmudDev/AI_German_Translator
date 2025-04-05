FROM node:18

WORKDIR /app
# Copy package files first (relative to Dockerfile location)
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy remaining files
COPY . .

# Build and serve
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]