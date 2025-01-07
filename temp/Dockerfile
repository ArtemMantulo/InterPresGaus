FROM node:21-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
