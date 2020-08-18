/**
 * Short ID generator. Usage example:
 *
 *    const id = await newUserId(); // => "ys59bg"
 *
 * @see https://zelark.github.io/nano-id-cc/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { customAlphabet } from "nanoid/async";
import db from "../db";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

function createNewId(table: string, size: number) {
  const generateId = customAlphabet(alphabet, size);

  return async function newId(verify = true) {
    let id = await generateId();

    // Ensures that the generated ID is unique
    while (verify) {
      const record = await db
        .table(table)
        .where({ id })
        .orWhere({ username: id })
        .first(db.raw(1));

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

export const newUserId = createNewId("users", 6);
