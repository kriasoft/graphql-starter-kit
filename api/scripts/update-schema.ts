/**
 * Generates `schema.graphql` file from the actual GraphQL schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import fs from "fs";
import path from "path";
import { printSchema } from "graphql";
import { schema } from "../src/schema";

const file = path.resolve(__dirname, "../schema.graphql");
const output = printSchema(schema, { commentDescriptions: true });

fs.writeFileSync(file, output, "utf8");
