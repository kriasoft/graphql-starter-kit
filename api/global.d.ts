/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import "express";
import { User } from "./core/index.js";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

declare module "graphql" {
  interface GraphQLFormattedError {
    status?: number;
    errors?: Record<string, string[]>;
  }
}
