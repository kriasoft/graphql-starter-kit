/**
 * Global type definitions (overrides).
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import type { User } from "db";

/* eslint-disable @typescript-eslint/no-unused-vars */

declare global {
  namespace Express {
    interface Request {
      user: User | null;
      signIn: (user: User | null | undefined) => Promise<User | null>;
      signOut: () => void;
    }
  }
}
