FROM node:8.2.1-alpine

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY . .

# Install Node.js dependencies
RUN yarn install --production --no-progress && yarn cache clean

CMD [ "node", "build/server.js" ]
