// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum IdentityProvider {
  google = "google",
  apple = "apple",
  facebook = "facebook",
  github = "github",
  linkedin = "linkedin",
  microsoft = "microsoft",
  twitter = "twitter",
  yahoo = "yahoo",
  gamecenter = "gamecenter",
  playgames = "playgames",
}

export type Identity = {
  provider: IdentityProvider;
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  email_verified: boolean | null;
  name: string | null;
  picture: string | null;
  given_name: string | null;
  family_name: string | null;
  locale: string | null;
  access_token: string | null;
  refresh_token: string | null;
  scopes: string[];
  token_type: string | null;
  created_at: Date;
  updated_at: Date;
  issued_at: Date | null;
  expires_at: Date | null;
};

export type User = {
  id: string;
  username: string;
  email: string | null;
  email_verified: boolean;
  name: string | null;
  picture: string | null;
  given_name: string | null;
  family_name: string | null;
  time_zone: string | null;
  locale: string | null;
  admin: boolean;
  blocked: boolean;
  archived: boolean;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
};
