/**
 * OAuth identity (credentials).
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { globalIdField } from "graphql-relay";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
import type { Identity } from "db";

import { dateField } from "../fields";
import { IdentityProviderType } from "../enums";
import { Context } from "../context";

export const IdentityType = new GraphQLObjectType<Identity, Context>({
  name: "Identity",

  fields: {
    id: globalIdField("Identity", (x) => `${x.provider}:${x.id}`),

    provider: {
      type: new GraphQLNonNull(IdentityProviderType),
    },

    username: {
      type: GraphQLString,
    },

    email: {
      type: GraphQLString,
    },

    emailVerified: {
      type: GraphQLBoolean,
      resolve(self) {
        return self.email_verified;
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

    locale: {
      type: GraphQLString,
    },

    scopes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },

    tokenType: {
      type: GraphQLString,
      resolve(self) {
        return self.token_type;
      },
    },

    createdAt: dateField((self) => self.created_at),
    updatedAt: dateField((self) => self.updated_at),
    issuedAt: dateField((self) => self.issued_at),
    expiresAt: dateField((self) => self.expires_at),
  },
});
