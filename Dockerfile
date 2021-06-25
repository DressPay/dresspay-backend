FROM node:slim

WORKDIR /app
COPY . /app
RUN npm install

CMD node index.js
