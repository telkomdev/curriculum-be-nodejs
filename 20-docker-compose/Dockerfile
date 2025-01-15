# Based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# ... with some local modifications:
# - Use node:16-alpine base. Much smaller.
# - Only copy package.json, don't include package-lock.json.
# - Selectively bundle app source, only copy "server.js" and "app"

FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Only copy package.json
COPY package.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Selectively bundle app source
COPY server.js .

EXPOSE 8080
CMD [ "node", "server.js" ]
