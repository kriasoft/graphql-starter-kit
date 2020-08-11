/**
 * GraphQL API mutations related to stories.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import slugify from "slugify";
import validator from "validator";
import { v4 as uuid } from "uuid";
import { mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";

import db, { Story } from "../db";
import { Context } from "../context";
import { StoryType } from "../types";
import { fromGlobalId, validate } from "../utils";

function slug(text: string) {
  return slugify(text, { lower: true });
}

export const upsertStory = mutationWithClientMutationId({
  name: "UpsertStory",
  description: "Creates or updates a story.",

  inputFields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    approved: { type: GraphQLBoolean },
    validateOnly: { type: GraphQLBoolean },
  },

  outputFields: {
    story: { type: StoryType },
    errors: {
      // TODO: Extract into a custom type.
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(GraphQLString)),
          ),
        ),
      ),
    },
  },

  async mutateAndGetPayload(input, ctx: Context) {
    const id = input.id ? fromGlobalId(input.id, "Story") : null;
    const newId = uuid();

    let story: Story | undefined;

    if (id) {
      story = await db.table<Story>("stories").where({ id }).first();

      if (!story) {
        throw new Error(`Cannot find the story # ${id}.`);
      }

      // Only the author of the story or admins can edit it
      ctx.ensureAuthorized(
        (user) => story?.author_id === user.id || user.admin,
      );
    } else {
      ctx.ensureAuthorized();
    }

    // Validate and sanitize user input
    const { data, errors } = validate(input, (x) =>
      x
        .field("title", { trim: true })
        .isRequired()
        .isLength({ min: 5, max: 80 })

        .field("text", { alias: "URL or text", trim: true })
        .isRequired()
        .isLength({ min: 10, max: 1000 })

        .field("text", {
          trim: true,
          as: "is_url",
          transform: (x) =>
            validator.isURL(x, { protocols: ["http", "https"] }),
        })

        .field("approved")
        .is(() => Boolean(ctx.user?.admin), "Only admins can approve a story."),
    );

    if (errors.length > 0) {
      return { errors };
    }

    if (data.title) {
      data.slug = `${slug(data.title)}-${(id || newId).substr(29)}`;
    }

    if (id && Object.keys(data).length) {
      [story] = await db
        .table<Story>("stories")
        .where({ id })
        .update({
          ...(data as Partial<Story>),
          updated_at: db.fn.now(),
        })
        .returning("*");
    } else {
      [story] = await db
        .table<Story>("stories")
        .insert({
          id: newId,
          ...(data as Partial<Story>),
          author_id: ctx.user?.id,
          approved: ctx.user?.admin ? true : false,
        })
        .returning("*");
    }

    return { story };
  },
});

export const likeStory = mutationWithClientMutationId({
  name: "LikeStory",
  description: 'Marks the story as "liked".',

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },

  outputFields: {
    story: { type: StoryType },
  },

  async mutateAndGetPayload(input, ctx: Context) {
    // Check permissions
    ctx.ensureAuthorized();

    const id = fromGlobalId(input.id, "Story");
    const keys = { story_id: id, user_id: ctx.user.id };

    const points = await db
      .table("story_points")
      .where(keys)
      .select(db.raw("1"));

    if (points.length) {
      await db.table("story_points").where(keys).del();
    } else {
      await db.table("story_points").insert(keys);
    }

    const story = db.table("stories").where({ id }).first();

    return { story };
  },
});
