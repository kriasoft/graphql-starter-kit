/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { Context, User } from "../core/index.js";
import { countField, dateField } from "./fields.js";
import { nodeInterface } from "./node.js";
import { PictureType } from "./picture.js";

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

    timeZone: {
      type: GraphQLString,
      resolve(self) {
        return self.time_zone;
      },
    },

    locale: {
      type: GraphQLString,
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
