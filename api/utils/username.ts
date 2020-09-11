/**
 * Username generator.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import db from "../db";

const USERNAME_REGEX = /^(?=.{2,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

export function isValidUsername(username?: string): boolean {
  return Boolean(username && username.match(USERNAME_REGEX));
}

export async function generateUsername(email?: string): Promise<string> {
  let username;

  // Extract username from the email address if it's available
  if (email) {
    [username = ""] = email.split("@");
    username = username
      .replace(/\+/g, "_")
      .replace(/(^[._]+|[._]+$|[^a-zA-Z0-9._])/g, "");
  }

  // Generate random username as a fallback
  if (!username) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    username = "";

    for (let i = 0; i < 7; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  // Verify that the username is unique
  const {
    rows: [{ exists }],
  } = await db.raw("SELECT EXISTS (SELECT * FROM users WHERE username = ?)", [
    username,
  ]);

  return exists ? generateUsername() : username;
}
