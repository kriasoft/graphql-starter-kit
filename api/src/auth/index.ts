/**
 * OAuth authentication middleware.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Router, Request, Response, NextFunction } from "express";
import * as google from "./google";

export const auth = Router();

auth.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

auth.get("/auth/google", google.auth);
auth.get("/auth/google/return", google.callback);
