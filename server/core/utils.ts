/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { fromGlobalId as parse } from "graphql-relay";
import { Knex } from "knex";
import { customAlphabet } from "nanoid";

// An alphabet for generating short IDs.
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

// Creates a function that generates a short ID of specified length.
export function createNewId(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  db: Knex<any, unknown[]>,
  table: string,
  size: number,
): (unique: boolean) => Promise<string> {
  const generateId = customAlphabet(alphabet, size);

  return async function newId(unique = true) {
    let id = generateId();

    // Ensures that the generated ID is unique
    while (unique) {
      const record = await db.table(table).where({ id }).first(db.raw(1));

      if (record) {
        console.warn(`Re-generating new ${table} ID.`);
        id = generateId();
      } else {
        break;
      }
    }

    return id;
  };
}

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
