/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { Context, User } from "../core";
import { countField, dateField } from "./fields";
import { IdentityType } from "./identity";
import { nodeInterface } from "./node";
import { PictureType } from "./picture";

export const UserType = new GraphQLObjectType<User, Context>({
  name: "User",
  description: "The registered user account.",
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
      type: new GraphQLNonNull(PictureType),
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

    identities: {
      type: new GraphQLList(new GraphQLNonNull(IdentityType)),
      resolve(self, args, ctx) {
        return ctx.user && (ctx.user.id === self.id || ctx.user.admin)
          ? ctx.identitiesByUserId.load(self.id)
          : null;
      },
    },

    created: dateField((self) => self.created),
    updated: dateField((self) => self.updated),
    lastLogin: dateField((self) => self.last_login),
  },
});

const connection = connectionDefinitions({
  name: "User",
  nodeType: UserType,
  connectionFields: { totalCount: countField },
});

export const UserConnection = connection.connectionType;
export const UserEdge = connection.edgeType;
