/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

declare module "graphql" {
  interface GraphQLFormattedError {
    fieldErrors?: Record<string, string[]>;
    formErrors?: Record<string, string[]>;
  }
}
