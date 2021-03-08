/**
 * OAuth identity (credentials).
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type { Identity } from "db";
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";
import { Context } from "../context";
import { IdentityProviderType } from "../enums";
import { dateField } from "../fields";

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
