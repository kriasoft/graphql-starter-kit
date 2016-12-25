#!/bin/sh
npm install -g yarn --no-progress --silent
yarn install --no-progress
yarn run db:migrate
node scripts/start.js
