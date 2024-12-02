FROM node:21-alpine as runner
COPY . .
RUN npm ci

EXPOSE 3003

CMD ["npm", "run", "start"]