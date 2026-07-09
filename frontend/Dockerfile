FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js untuk production
RUN npm run build

# Next.js secara default berjalan di port 3000
EXPOSE 3000

CMD ["npm", "run", "start"]