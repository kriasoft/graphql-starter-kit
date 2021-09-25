/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { fromGlobalId as parse } from "graphql-relay";

/**
 * Converts (Relay) global ID into a raw database ID.
 */
export function fromGlobalId(globalId: string, expectedType: string): string {
  const { id, type } = parse(globalId);

  if (expectedType && type !== expectedType) {
    throw new Error(
      `Expected an ID of type '${expectedType}' but got '${type}'.`,
    );
  }

  return id;
}
