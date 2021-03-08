/**
 * 0Auth identity provider.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { IdentityProvider } from "db/types";
import { GraphQLEnumType } from "graphql";
import { mapValues } from "lodash";

export const IdentityProviderType = new GraphQLEnumType({
  name: "IdentityProvider",
  values: mapValues(IdentityProvider, (value) => ({ value })),
});
