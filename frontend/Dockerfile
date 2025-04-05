FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install serve
EXPOSE 10000
CMD ["npx", "serve", "-s", "build", "-l", "10000"]