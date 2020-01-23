/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { Request, Response, NextFunction } from 'express';

export default function auth(req: Request, res: Response, next: NextFunction) {
  // TODO: Validate authentication token
  next();
}
