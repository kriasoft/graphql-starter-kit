/**
 * Global type definitions (overrides).
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from "./db";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
      signIn: (user: User | null | undefined) => Promise<User | null>;
      signOut: () => void;
    }
  }
}
