/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import GraphicsMagick from "gm";
import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { fromGlobalId } from "graphql-relay";
import { BadRequest } from "http-errors";
import { extname } from "node:path";
import { URL } from "node:url";
import { Context, db, uploadBucket, User } from "../core";
import env from "../env";
import { UploadTypeType, UserType } from "../types";

const gm = GraphicsMagick.subClass({ imageMagick: true });

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
    ctx.ensureAuthorized();

    // Parse input arguments
    const { id, type } = fromGlobalId(args.id);
    const url = new URL(args.uploadURL);

    // Validate the uploaded file URL
    if (url.hostname !== env.UPLOAD_BUCKET) {
      throw new Error(`Invalid upload URL: ${args.uploadURL}`);
    }

    // Save user profile picture
    if (type === "User" && args.uploadType === "profile-picture") {
      ctx.ensureAuthorized((user) => user.id === id || user.admin);
      let user = await db.table<User>("user").where({ id }).first();
      if (!user) throw new BadRequest(`User not found (id: ${id}).`);

      // Copy the uploaded image to the primary storage bucket
      const size = await getImageSize(url);
      const filename = `u/${user.id}${extname(url.pathname)}`;
      const version = ((user.picture.version as number) ?? 0) + 1;
      await uploadBucket
        .file(url.pathname.substring(1))
        .copy(`gs://${env.STORAGE_BUCKET}/${filename}`);

      // Update profile picture filename, version
      [user] = await db
        .table<User>("user")
        .where({ id })
        .update("picture", {
          filename,
          version,
          ...size,
        })
        .returning("*");

      return { user };
    }

    throw new BadRequest();
  },
};

async function getImageSize(
  url: URL,
): Promise<{ width: number; height: number }> {
  // Download the original file
  const [file] = await uploadBucket.file(url.pathname.substring(1)).download();
  // Get the uploaded image size using ImageMagick
  return new Promise((resolve, reject) =>
    gm(file).size((err, size) => (err ? reject(err) : resolve(size))),
  );
}
