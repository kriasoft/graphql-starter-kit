/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import fs from 'fs';
import dotenv from 'dotenv';
import graphql from 'express-graphql';
import { printSchema } from 'graphql';
import express, { Router, Request, Response } from 'express';

dotenv.config({ path: '.env' });

import auth from './auth';
import schema from './schema';
import { Context } from './context';

const port = process.env.PORT || 8080;

export const api = Router();

api.use(auth);
api.use(
  '/graphql',
  graphql(req => ({
    schema,
    context: new Context(req),
    graphiql: process.env.APP_ENV !== 'production',
    pretty: false,
    customFormatErrorFn: err => {
      console.error(err.originalError || err);
      return {
        message: err.message,
        code: err.originalError && err.originalError.code,
        state: err.originalError && err.originalError.state,
        locations: err.locations,
        path: err.path,
      };
    },
  })),
);

if (process.env.NODE_ENV !== 'production') {
  const app = express();

  app.use(api);
  app.get('/', (req: Request, res: Response) => {
    res.redirect('/api');
  });

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}/`);
  });

  fs.writeFileSync(
    'schema.graphql',
    printSchema(schema, { commentDescriptions: true }),
    'utf8',
  );
}
