/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { fromGlobalId, nodeDefinitions } from "graphql-relay";
import { Context } from "../core";

/**
 * The `Node` interface for global object identification.
 *
 * @see https://relay.dev/graphql/objectidentification.htm
 */
export const { nodeInterface, nodeField, nodesField } =
  nodeDefinitions<Context>(
    (globalId, ctx) => {
      const { type, id } = fromGlobalId(globalId);

      switch (type) {
        case "User":
          return ctx.userById.load(id);
        default:
          return null;
      }
    },
    (value): string | undefined => {
      if (value.email !== undefined) return "User";
    },
  );
