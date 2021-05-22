FROM node:lts-alpine3.13
# FROM node:14

EXPOSE 8000

# Create app directory
WORKDIR /usr/src/project

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY server.js .
COPY server server
COPY app app
COPY static static

# If you are building your code for production
# RUN npm ci --only=production

CMD [ "npm", "start" ]
