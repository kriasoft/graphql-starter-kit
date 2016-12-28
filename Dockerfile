FROM node:7.3.0-alpine

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY build .

# Install Yarn and Node.js dependencies
RUN npm install yarn --global --no-progress --silent --depth 0 \
    && yarn install --production --no-progress

CMD [ "node", "server.js" ]
