FROM node:21-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run gulp

EXPOSE 3003

CMD ["npm", "run", "start"]