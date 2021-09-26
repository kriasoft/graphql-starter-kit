/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { GraphQLFieldConfig } from "graphql";
import { GraphQLString } from "graphql";
import moment from "moment-timezone";
import { Context } from "../context";

/**
 * GraphQL field for returning dates in various formats (defaults to ISO)
 * with respect to the currently logged-in user's time zone.
 *
 * @see https://momentjs.com/docs/#/displaying/format/
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
      const date = resolve(self);

      if (date) {
        const timeZone = ctx.user?.time_zone;
        return timeZone
          ? moment(date).tz(timeZone).format(args.format)
          : moment(date).format(args.format);
      }
    },
  };
}
