FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Terima argumen dari GitHub Actions
ARG NEXT_PUBLIC_API_URL
# Jadikan environment variable untuk proses build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js untuk production
RUN npm run build

# Next.js secara default berjalan di port 3000
EXPOSE 3000

CMD ["npm", "run", "start"]