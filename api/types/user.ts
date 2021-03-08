/**
 * The custom GraphQL type that represents a user account.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type { User } from "db";
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";
import { Context } from "../context";
import { dateField } from "../fields";
import { nodeInterface } from "../node";
import { IdentityType } from "./identity";

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

    emailVerified: {
      type: GraphQLBoolean,
      resolve(self, args, ctx) {
        return ctx.user && (ctx.user.id === self.id || ctx.user.admin)
          ? self.email_verified
          : null;
      },
    },

    name: {
      type: GraphQLString,
    },

    picture: {
      type: GraphQLString,
    },

    givenName: {
      type: GraphQLString,
      resolve(self) {
        return self.given_name;
      },
    },

    familyName: {
      type: GraphQLString,
      resolve(self) {
        return self.family_name;
      },
    },

    timeZone: {
      type: GraphQLString,
      resolve(self) {
        return self.time_zone;
      },
    },

    locale: {
      type: GraphQLString,
    },

    admin: {
      type: GraphQLBoolean,
    },

    blocked: {
      type: GraphQLBoolean,
    },

    identities: {
      type: new GraphQLList(new GraphQLNonNull(IdentityType)),
      resolve(self, args, ctx) {
        return ctx.user && (ctx.user.id === self.id || ctx.user.admin)
          ? ctx.identitiesByUserId.load(self.id)
          : null;
      },
    },

    createdAt: dateField((self) => self.created_at),
    updatedAt: dateField((self) => self.updated_at),
    lastLogin: dateField((self) => self.last_login),
  },
});
