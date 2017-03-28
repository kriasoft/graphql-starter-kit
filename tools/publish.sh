#!/bin/sh -e

# Read application name from 'package.json'
SERVICE_NAME=$(cat package.json \
  | grep '"name"' \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Compile the app into the ./build folder
docker-compose run --rm api /bin/sh -c "yarn install; yarn run build"

# Build a Docker image for production
docker build --no-cache -t $SERVICE_NAME .

# Push it to a remote server via ssh (as an example)
docker save $SERVICE_NAME | ssh -C user@host docker load
ssh -C user@host docker-compose up
