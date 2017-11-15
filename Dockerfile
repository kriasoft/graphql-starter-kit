FROM node:8.9.1-alpine

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# Set a working directory
WORKDIR /usr/src/app

# Install native dependencies
# RUN set -ex; \
#   apk add --no-cache ...

# Install Node.js dependencies
COPY package.json yarn.lock ./
RUN set -ex; \
  if [ "$NODE_ENV" = "production" ]; then \
  yarn install --no-cache --no-progress --frozen-lockfile --production; \
  else \
  touch yarn-error.log; \
  mkdir -p /home/node/.cache/yarn node_modules; \
  chown -R node:node /home/node/.cache/yarn node_modules yarn-error.log; \
  chmod 777 /home/node/.cache/yarn node_modules yarn-error.log; \
  fi;

# Run the container under "node" user by default
USER node

# Copy application files
COPY tools ./tools/
COPY migrations ./migrations/
COPY seeds ./seeds/
COPY locales ./locales/
COPY build ./build/

CMD [ "node", "build/server.js" ]
