/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import moment from 'moment-timezone';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { Context } from './context';

const dateFieldArgs = {
  format: { type: GraphQLString },
};

const dateFieldResolve = (resolve: any, self: any, args: any, ctx: Context) => {
  let date = resolve(self);

  if (!date) {
    return null;
  }

  const timeZone = ctx.user && ctx.user.timeZone;

  if (timeZone) {
    date = moment(date).tz(timeZone);
  } else {
    date = moment(date);
  }

  return date.format(args.format);
};

/**
 * Creates the configuration for a date/time field with support of format and
 * time zone.
 */
export function dateField(resolve: any) {
  return {
    type: GraphQLString,
    args: dateFieldArgs,
    resolve: dateFieldResolve.bind(undefined, resolve),
  };
}

export const countField = {
  type: new GraphQLNonNull(GraphQLInt),
  resolve(self: any) {
    return self.query.count().then((x: any) => x[0].count);
  },
};
