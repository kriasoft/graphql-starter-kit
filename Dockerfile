FROM node:8.4.0-alpine

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY . .

# Install dependencies
RUN apk add --no-cache libsodium && \
    yarn install --production --no-progress && \
    yarn cache clean

# Run the container under "node" user by default
USER node

CMD [ "node", "--napi-modules", "build/server.js" ]
