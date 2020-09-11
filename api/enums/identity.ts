/**
 * 0Auth identity provider.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { mapValues } from "lodash";
import { GraphQLEnumType } from "graphql";
import { IdentityProvider } from "db/types";

export const IdentityProviderType = new GraphQLEnumType({
  name: "IdentityProvider",
  values: mapValues(IdentityProvider, (value) => ({ value })),
});
