/**
 * Relay.js global ID helper function(s).
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { fromGlobalId as parse } from "graphql-relay";

export function fromGlobalId(globalId: string, expectedType: string): string {
  const { id, type } = parse(globalId);

  if (expectedType && type !== expectedType) {
    throw new Error(
      `Expected an ID of type '${expectedType}' but got '${type}'.`,
    );
  }

  return id;
}
