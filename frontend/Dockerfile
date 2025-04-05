FROM node:18

WORKDIR /app

# Verify files exist before copying
RUN ls -la /app/

# Explicit copy from build context
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]