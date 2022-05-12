/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Knex } from "knex";
import { customAlphabet } from "nanoid/async";

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
    let id = await generateId();

    // Ensures that the generated ID is unique
    while (unique) {
      const record = await db.table(table).where({ id }).first(db.raw(1));

      if (record) {
        console.warn(`Re-generating new ${table} ID.`);
        id = await generateId();
      } else {
        break;
      }
    }

    return id;
  };
}
