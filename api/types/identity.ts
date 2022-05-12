/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";
import { Identity } from "../core";
import { IdentityProviderType } from "./enums";
import { dateField } from "./fields";

export const IdentityType = new GraphQLObjectType<Identity>({
  name: "Identity",
  description: "The OAuth user identity (credentials).",

  fields: {
    id: globalIdField("Identity", (self) => `${self.provider}:${self.id}`),

    provider: {
      type: new GraphQLNonNull(IdentityProviderType),
    },

    username: {
      type: GraphQLString,
    },

    email: {
      type: GraphQLString,
    },

    created: dateField((self) => self.created),
    updated: dateField((self) => self.updated),
  },
});
