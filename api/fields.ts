/**
 * Helper functions for creating GraphQL query fields
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import moment from "moment-timezone";
import { QueryBuilder } from "knex";
import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { Context } from "./context";

/**
 * Creates the configuration for a date/time field with support of format and
 * time zone.
 */
export function dateField<TSource>(
  resolve: (self: TSource) => Date | string | null | undefined,
): GraphQLFieldConfig<TSource, Context, { format?: string }> {
  return {
    type: GraphQLString,

    args: {
      format: { type: GraphQLString },
    },

    resolve(self, args, ctx) {
      const date = resolve(self);

      if (!date) return null;

      const timeZone = ctx.user?.time_zone;

      return timeZone
        ? moment(date).tz(timeZone).format(args.format)
        : moment(date).format(args.format);
    },
  };
}

export const countField: GraphQLFieldConfig<
  { query: QueryBuilder },
  Context
> = {
  type: new GraphQLNonNull(GraphQLInt),
  resolve(self) {
    return self.query.count().then((x: { count: number }[]) => x[0].count);
  },
};
