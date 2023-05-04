/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import "express";
import { DecodedIdToken } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      token: DecodedIdToken | null;
    }
  }
}

declare module "graphql" {
  interface GraphQLFormattedError {
    status?: number;
    errors?: Record<string, string[]>;
  }
}
