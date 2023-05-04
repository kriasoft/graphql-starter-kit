/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { UserRecord } from "firebase-admin/auth";
import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { Context } from "../core/index.js";
import { countField, dateField } from "./fields.js";
import { nodeInterface } from "./node.js";
import { PictureType } from "./picture.js";

export const UserType = new GraphQLObjectType<UserRecord, Context>({
  name: "User",
  description: "The registered user account.",
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField("User", (self) => self.uid),

    email: {
      type: GraphQLString,
      resolve(self, args, ctx) {
        return ctx.token && (ctx.token.uid === self.uid || ctx.token?.admin)
          ? self.email
          : null;
      },
    },

    emailVerified: {
      type: GraphQLBoolean,
      resolve(self, args, ctx) {
        return ctx.token && (ctx.token.uid === self.uid || ctx.token?.admin)
          ? self.emailVerified
          : null;
      },
    },

    displayName: {
      type: GraphQLString,
    },

    picture: {
      type: new GraphQLNonNull(PictureType),
      resolve(self) {
        return { url: self.photoURL };
      },
    },

    // timeZone: {
    //   type: GraphQLString,
    // },

    // locale: {
    //   type: GraphQLString,
    // },

    disabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },

    created: dateField((self) => self.metadata.creationTime),
    updated: dateField((self) => self.metadata.lastRefreshTime),
    lastLogin: dateField((self) => self.metadata.lastSignInTime),
  },
});

const connection = connectionDefinitions({
  name: "User",
  nodeType: UserType,
  connectionFields: { totalCount: countField },
});

export const UserConnection = connection.connectionType;
export const UserEdge = connection.edgeType;
