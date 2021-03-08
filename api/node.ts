/**
 * The Node interface for compatibility with Relay.js.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

/* eslint-disable @typescript-eslint/no-var-requires */

import { fromGlobalId, nodeDefinitions } from "graphql-relay";
import { Context } from "./context";
import { assignType, getType } from "./utils";

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
