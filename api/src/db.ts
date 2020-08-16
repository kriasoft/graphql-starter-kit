/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import fs from "fs";
import knex from "knex";
import env from "./env";

const db = knex({
  client: "pg",

  connection: {
    ssl: env.PGSSLMODE === "verify-ca" && {
      cert: fs.readFileSync(env.PGSSLCERT, "ascii"),
      key: fs.readFileSync(env.PGSSLKEY, "ascii"),
      ca: fs.readFileSync(env.PGSSLROOTCERT, "ascii"),
      servername: ((x) => `${x[0]}:${x[2]}`)(env.GOOGLE_CLOUD_SQL.split(":")),
    },
  },

  // Note that the max connection pool size must be set to 1
  // in a serverless environment.
  pool: {
    min: env.APP_ENV === "production" ? 1 : 0,
    max: 1,
  },

  debug: env.PGDEBUG,
});

export default db;

// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export type CommentPoint = {
  comment_id: string;
  user_id: string;
};

export type Comment = {
  id: string;
  story_id: string;
  parent_id: string | null;
  author_id: string;
  text: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Story = {
  id: string;
  author_id: string;
  slug: string;
  title: string;
  text: string | null;
  is_url: boolean;
  approved: boolean;
  created_at: Date;
  updated_at: Date;
};

export type StoryPoint = {
  story_id: string;
  user_id: string;
};

export type User = {
  id: string;
  username: string;
  email: string | null;
  display_name: string | null;
  photo: string | null;
  time_zone: string | null;
  admin: boolean;
  archived: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
};
