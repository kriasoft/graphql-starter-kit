// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum Table {
  User = "user",
}

export type Tables = {
  "user": User,
};

export type User = {
  id: string;
  email: string | null;
  email_verified: boolean;
  name: string | null;
  picture: Record<string, unknown>;
  time_zone: string | null;
  locale: string | null;
  admin: boolean;
  created: Date;
  updated: Date;
  deleted: Date | null;
  last_login: Date | null;
};

