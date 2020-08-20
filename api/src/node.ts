/**
 * The Node interface for compatibility with Relay.js.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

/* eslint-disable @typescript-eslint/no-var-requires */

import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import { assignType, getType } from "./utils";
import { Context } from "./context";

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, context: Context) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case "User":
        return context.userById.load(id).then(assignType("User"));
      default:
        return null;
    }
  },
  (obj) => {
    switch (getType(obj)) {
      case "User":
        return require("./types").UserType;
      default:
        return null;
    }
  },
);
