/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { fromGlobalId, nodeDefinitions } from "graphql-relay";
import { Context } from "../core/index.js";

/**
 * The `Node` interface for global object identification.
 *
 * @see https://relay.dev/graphql/objectidentification.htm
 */
export const {
  nodeInterface,
  nodeField: node,
  nodesField: nodes,
} = nodeDefinitions<Context>(
  function fetchById(globalId, ctx) {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case "User":
        return ctx.userById.load(id);
      default:
        return null;
    }
  },
  function resolveType(value): string | undefined {
    if (value.email !== undefined) {
      return "User";
    }
  },
);
