/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import "express";
import { User } from "./core";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
      signIn: (user: User | null | undefined) => Promise<User | null>;
      signOut: () => void;
    }
  }
}

declare module "graphql" {
  interface GraphQLFormattedError {
    status?: number;
    errors?: Record<string, string[]>;
  }
}
