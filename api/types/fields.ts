/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { formatISO } from "date-fns";
import { format } from "date-fns-tz";
import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { Knex } from "knex";
import { Context } from "../core";

type Source = { query: Knex.QueryBuilder };

/**
 * GraphQL field for returning dates in various formats (defaults to ISO)
 * with respect to the currently logged-in user's time zone.
 *
 * @see https://date-fns.org/docs/format
 * @example
 *   createdAt: dateField(self => self.createdAt)
 *
 *   query {
 *     me {
 *       createdAt(format: "ddd, hA") => "Sun, 3PM"
 *     }
 *   }
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
      const value = resolve(self);
      const date = typeof value === "string" ? new Date(value) : value;

      if (date) {
        if (args.format) {
          const timeZone = ctx.user?.time_zone || "America/New_York";
          return format(date, args.format, { timeZone });
        }
        return formatISO(date);
      }
    },
  };
}

/**
 * The total count field definition.
 *
 * @example
 *   query {
 *     users {
 *       totalCount
 *     }
 *   }
 */
export const countField: GraphQLFieldConfig<Source, Context> = {
  type: new GraphQLNonNull(GraphQLInt),

  async resolve(self) {
    const rows = await self.query.count();
    return rows[0].count;
  },
};
