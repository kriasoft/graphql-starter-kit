FROM node:7.8.0-alpine

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY . .

# Install Node.js dependencies
RUN yarn install --production --no-progress

CMD [ "node", "build/server.js" ]
