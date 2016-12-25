FROM node:7.3.0-alpine

# Copy application files
COPY ./build /usr/src/app
WORKDIR /usr/src/app

# Install Node.js dependencies
RUN npm install -g yarn --no-progress --silent \
    && yarn install --production --no-progress

CMD [ "node", "server.js" ]
