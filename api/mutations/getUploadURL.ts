import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { customAlphabet } from "nanoid/async";
import path from "path";
import { Context } from "../context";
import { storage } from "../core";
import env from "../env";

const newId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

/**
 * Generates a URL for user uploaded content that expires in 10 minutes.
 *
 * @example
 *   mutation {
 *     getUploadURL(fileName: "photo.jpg")
 *   }
 */
export const getUploadURL: GraphQLFieldConfig<unknown, Context> = {
  type: GraphQLString,

  args: {
    fileName: { type: new GraphQLNonNull(GraphQLString) },
    contentType: { type: GraphQLString },
  },

  async resolve(self, args, ctx) {
    // Only authenticated users can upload files
    ctx.ensureAuthorized();

    // Create a temporary for the uploaded content
    const fileName = `${await newId()}${path.extname(args.fileName)}`;
    const [url] = await storage
      .bucket(env.UPLOAD_BUCKET)
      .file(fileName)
      .getSignedUrl({
        action: "write",
        version: "v4",
        expires: Date.now() + 600000 /* 10 min */,
        contentType: args.contentType,
        virtualHostedStyle: true,
        cname: `https://${env.UPLOAD_BUCKET}`,
      });

    return url;
  },
};
