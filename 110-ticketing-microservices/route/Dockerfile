FROM node:16-alpine
WORKDIR /app
COPY package*.json .
RUN npm i 
RUN mkdir data
COPY server.js .
COPY app app

EXPOSE 8082

CMD ["npm", "start"]