/**
 * The custom GraphQL type that represents a user account.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { globalIdField } from "graphql-relay";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";

import { User } from "../db";
import { nodeInterface } from "../node";
import { dateField } from "../fields";
import { Context } from "../context";

export const UserType = new GraphQLObjectType<User, Context>({
  name: "User",
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    username: {
      type: new GraphQLNonNull(GraphQLString),
    },

    email: {
      type: GraphQLString,
      resolve(self, args, ctx) {
        return ctx.user && (ctx.user.id === self.id || ctx.user.admin)
          ? self.email
          : null;
      },
    },

    displayName: {
      type: GraphQLString,
      resolve(self) {
        return self.display_name;
      },
    },

    photoURL: {
      type: GraphQLString,
      resolve(self) {
        return self.photo;
      },
    },

    timeZone: {
      type: GraphQLString,
      resolve(self) {
        return self.time_zone;
      },
    },

    admin: {
      type: GraphQLBoolean,
    },

    createdAt: dateField((self) => self.created_at),
    updatedAt: dateField((self) => self.updated_at),
    lastLoginAt: dateField((self) => self.last_login_at),
  },
});
