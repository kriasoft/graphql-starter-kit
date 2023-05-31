/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { fromGlobalId } from "graphql-relay";
import { BadRequest, Forbidden, Unauthorized } from "http-errors";
import { extname } from "node:path";
import { URL } from "node:url";
import { Context, uploadBucket } from "../core";
import env from "../env";
import { UploadTypeType, UserType } from "../types";

/**
 * Saves the uploaded file (URL path) to the database.
 *
 * @example
 *   mutation {
 *     saveUpload(id: "...", uploadURL: "...", uploadType: ProfilePicture) {
 *       user {
 *         id
 *         picture {
 *           url
 *         }
 *       }
 *     }
 *   }
 */
export const saveUpload: GraphQLFieldConfig<unknown, Context> = {
  description: "Saves the uploaded file (URL path) to the database",

  type: new GraphQLObjectType({
    name: "SaveUploadPayload",
    fields: {
      user: { type: UserType },
    },
  }),

  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    uploadURL: { type: new GraphQLNonNull(GraphQLString) },
    uploadType: { type: new GraphQLNonNull(UploadTypeType) },
  },

  async resolve(self, args, ctx) {
    // Check permissions
    if (!ctx.token) {
      throw new Unauthorized();
    }

    // Parse input arguments
    const { id, type } = fromGlobalId(args.id);
    const url = new URL(args.uploadURL);

    // Validate the uploaded file URL
    if (url.hostname !== env.UPLOAD_BUCKET) {
      throw new Error(`Invalid upload URL: ${args.uploadURL}`);
    }

    // Save user profile picture
    if (type === "User" && args.uploadType === "profile-picture") {
      if (ctx.token.uid !== id && !ctx.token.admin) {
        throw new Forbidden();
      }

      let user = await ctx.userById.load(ctx.token.uid);
      if (!user) throw new BadRequest(`User not found (id: ${id}).`);

      // Copy the uploaded image to the primary storage bucket
      const filename = `u/${user.uid}${extname(url.pathname)}`;
      await uploadBucket
        .file(url.pathname.substring(1))
        .copy(`gs://${env.STORAGE_BUCKET}/${filename}`);

      await ctx.auth.updateUser(ctx.token.uid, {
        photoURL: `https://${env.STORAGE_BUCKET}.storage.googleapis.com/${filename}`,
      });

      user = await ctx.auth.getUser(ctx.token.uid);

      return { user };
    }

    throw new BadRequest();
  },
};
