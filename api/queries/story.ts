/**
 * The top-level GraphQL API query fields related to stories.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from "graphql";

import db from "../db";
import { Context } from "../context";
import { StoryType } from "../types";

export const story: GraphQLFieldConfig<unknown, Context> = {
  type: StoryType,

  args: {
    slug: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(root, { slug }) {
    let story = await db.table("stories").where({ slug }).first();

    // Attempts to find a story by partial ID contained in the slug.
    if (!story) {
      const match = slug.match(/[a-f0-9]{7}$/);
      if (match) {
        story = await db
          .table("stories")
          .whereRaw(`id::text LIKE '%${match[0]}'`)
          .first();
      }
    }

    return story;
  },
};

export const stories: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLList(StoryType),

  resolve(self, args, ctx) {
    return db
      .table("stories")
      .where({ approved: true })
      .orWhere({ approved: false, author_id: ctx.user ? ctx.user.id : null })
      .orderBy("created_at", "desc")
      .limit(100)
      .select();
  },
};
