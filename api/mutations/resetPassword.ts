/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import sgMail, { ResponseError } from "@sendgrid/mail";
import argon2 from "argon2";
import { GraphQLFieldConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { Context, db, User, UserAction, UserActionType } from "../core";
import env from "../env";
import { UserType } from "../types";
import { ValidationError } from "../utils";

/**
 * @example
 *   # Request a password reset code
 *   mutation {
 *     resetPassword(username: "koistya") {
 *       user { id }
 *     }
 *   }
 *
 *   # Update user's password
 *   mutation {
 *     resetPassword(username: "koistya", password: "Passw0rd", code: "224466") {
 *       user { id }
 *     }
 *   }
 */
export const resetPassword: GraphQLFieldConfig<unknown, Context> = {
  description: "Sends password recovery code to the user's email address",

  type: new GraphQLObjectType({
    name: "ResetPasswordPayload",
    fields: { user: { type: UserType } },
  }),

  args: {
    username: { type: GraphQLString, description: "Username or email" },
    password: { type: GraphQLString, description: "New password" },
    code: { type: GraphQLString, description: "Verification code" },
  },

  async resolve(self, args, ctx) {
    if (!args.username) {
      throw new ValidationError({
        username: ["Username or email is required."],
      });
    }

    // Find user by username or email
    const query = db.table<User>("user");

    if (args.username?.includes("@")) {
      query.where("email", "=", args.username);
      query.orderBy("email_verified", "desc");
      query.orderBy("created", "desc");
    } else {
      query.where("username", "=", args.username);
    }

    const user = await query.first();

    if (!user?.email) {
      throw new ValidationError({ username: ["User not found."] });
    }

    // Check if verification code was already requested by the user
    const action = await db
      .table<UserAction>("user_action")
      .where({ user_id: user.id, action: UserActionType.ResetPassword })
      .whereRaw("created + '15 minute'::interval > CURRENT_TIMESTAMP")
      .orderBy("created", "desc")
      .first();
    let code = action?.metadata?.code;

    if (args.code === null || args.code === undefined) {
      if (!code || action?.metadata?.redeemed) {
        code = `${Math.floor(Math.random() * 899999) + 100000}`;
      }

      // Save verification code in the database
      await db.table<UserAction>("user_action").insert({
        user_id: user.id,
        action: UserActionType.ResetPassword,
        metadata: { code, redeemed: false },
      });

      // Send verification code to the user
      try {
        await sgMail.send({
          from: env.EMAIL_FROM,
          replyTo: env.EMAIL_REPLY_TO,
          to: user.email,
          templateId: "d-5baad2e6abe3401fa0c734e2d987864b",
          dynamicTemplateData: { code },
        });
      } catch (err) {
        if (err instanceof ResponseError) {
          ctx.log("ERROR", err.response?.body);
        }
        throw new Error("Failed to send the verification code.");
      }
    } else if (code === "") {
      throw new ValidationError({ code: ["Cannot be empty."] });
    } else if (
      !code ||
      args.code !== code ||
      action?.metadata?.redeemed === true
    ) {
      throw new ValidationError({
        code: ["Verification code is invalid or expired."],
      });
    } else if (args.password === "") {
      throw new ValidationError({ password: ["Cannot be empty."] });
    } else if (args.password) {
      if (args.password.length < 8) {
        throw new ValidationError({
          password: ["Must be at lest 8 characters long."],
        });
      }

      // Mark the verification code as redeemed
      await db
        .table<UserAction>("user_action")
        .where({ id: action?.id })
        .update({
          metadata: { ...action?.metadata, redeemed: true },
          updated: db.fn.now(),
        });

      // Update user's password
      await db
        .table<User>("user")
        .where({ id: user.id })
        .update({
          email_verified: true,
          password: await argon2.hash(args.password),
          updated: db.fn.now(),
        });

      // Create an authentication session
      return { user: await ctx.signIn(user) };
    }

    return { user: null };
  },
};
