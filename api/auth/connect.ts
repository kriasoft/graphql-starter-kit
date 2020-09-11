/**
 * Links OAuth credentials (identity) to a user account.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Request } from "express";
import type { User, Identity } from "db";

import db from "../db";
import { newUserId } from "../utils";

export default async function connect(
  req: Request,
  identity: Partial<Omit<Identity, "user_id">>,
): Promise<User | null> {
  // Get the currently authenticated user from session
  let user: User | null | undefined = req.user;

  // If user is not authenticated, find user by credentials
  if (!user) {
    user = await db
      .table<Identity>("identities")
      .leftJoin<User>("users", "users.id", "identities.user_id")
      .where({
        "identities.id": identity.id,
        "identities.provider": identity.provider,
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .first<User>("users.*");
  }

  // Otherwise, find user account by email
  if (!user && identity.email && identity.email_verified !== false) {
    user = await db
      .table<User>("users")
      .where({ email: identity.email })
      .orderBy("email_verified", "desc")
      .first();
  }

  // Alternatively, create a new user account
  if (!user) {
    const userId = await newUserId(true);
    [user] = await db
      .table<User>("users")
      .insert({
        id: userId,
        username: userId,
        email: identity.email,
        email_verified: identity.email_verified ?? false,
        name: identity.name,
        picture: identity.picture,
        given_name: identity.given_name,
        family_name: identity.family_name,
        locale: identity.locale,
      })
      .returning("*");
  }

  // Link credentials to user account
  if (user) {
    const key = { provider: identity.provider, id: identity.id };
    const dbIdentity = await db
      .table<Identity>("identities")
      .where(key)
      .first();

    if (dbIdentity) {
      if (dbIdentity.user_id !== user.id) {
        throw new Error(
          "These credentials already linked to another user account.",
        );
      }

      await db
        .table<Identity>("identities")
        .where(key)
        .update({
          ...identity,
          user_id: user.id,
          updated_at: db.fn.now(),
        });
    } else {
      await db.table<Identity>("identities").insert({
        ...identity,
        user_id: user.id,
      });
    }
  }

  return req.signIn(user);
}
