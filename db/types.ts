// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum IdentityProvider {
  Google = "google",
  Apple = "apple",
  Facebook = "facebook",
  GitHub = "github",
  LinkedIn = "linkedin",
  Microsoft = "microsoft",
  Twitter = "twitter",
  Yahoo = "yahoo",
  GameCenter = "gamecenter",
  PlayGames = "playgames",
}

export enum UserActionType {
  ResetPassword = "reset_password",
  LoginFailed = "login_failed",
}

export enum Table {
  Identity = "identity",
  User = "user",
  UserAction = "user_action",
}

export type Identity = {
  provider: IdentityProvider;
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  profile: Record<string, unknown>;
  credentials: Record<string, unknown>;
  created: Date;
  updated: Date;
};

export type User = {
  id: string;
  username: string;
  email: string | null;
  email_verified: boolean;
  password: string | null;
  name: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: Record<string, unknown>;
  time_zone: string | null;
  locale: string | null;
  admin: boolean;
  created: Date;
  updated: Date;
  deleted: Date | null;
  last_login: Date | null;
};

export type UserAction = {
  id: string;
  user_id: string;
  action: UserActionType;
  metadata: Record<string, unknown>;
  created: Date;
  updated: Date;
};

