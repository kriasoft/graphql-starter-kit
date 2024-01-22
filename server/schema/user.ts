/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as Db from "db/models";
import { db } from "../core";
import { relyingparty } from "../core/auth";
import { builder } from "./builder";

export const User = builder.objectRef<User>("User");

User.implement({
  fields: (t) => ({
    id: t.exposeID("localId"),
    email: t.exposeString("email", { nullable: true }),
    emailVerified: t.exposeBoolean("emailVerified", { nullable: true }),
    displayName: t.exposeString("displayName", { nullable: true }),
    photoUrl: t.exposeString("photoUrl", { nullable: true }),
    locale: t.exposeString("locale", { nullable: true }),
    timeZone: t.exposeString("time_zone", { nullable: true }),
    disabled: t.exposeBoolean("disabled", { nullable: true }),
    createdAt: t.exposeString("createdAt", { nullable: true }),
    lastLoginAt: t.exposeString("lastLoginAt", { nullable: true }),
  }),
});

builder.queryField("user", (t) =>
  t.field({
    type: User,
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    async resolve(_, args): Promise<User> {
      const id = String(args.id);
      const result = await Promise.all([
        relyingparty
          .getAccountInfo({
            // quotaUser: ctx.token.uid,
            requestBody: { localId: [id] },
          })
          .then((res) => res.data.users?.[0]),
        db.from<Db.User>("user").where("id", "=", id).first(),
      ]);

      const account = result[0];
      let user = result[1];

      // User account not found.
      if (!account) return null as unknown as User;

      // Create user record if it doesn't exist.
      if (!user) {
        user = await db
          .table<Db.User>("user")
          .insert({ id: id as Db.UserId })
          .returning("*")
          .first();
      }

      return {
        ...account,
        ...user,
        localId: id,
        id: id as Db.UserId,
      };
    },
  }),
);

export interface User extends Db.UserInitializer {
  localId: string;
  email?: string | null;
  emailVerified?: boolean | null;
  displayName?: string | null;
  photoUrl?: string | null;
  disabled?: boolean | null;
  createdAt?: string | null;
  lastLoginAt?: string | null;
}
