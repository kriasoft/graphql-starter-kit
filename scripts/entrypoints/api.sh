#!/bin/sh

npm install -g yarn --no-progress --silent
yarn install
node --harmony scripts/db.js migrate
node scripts/start.js
