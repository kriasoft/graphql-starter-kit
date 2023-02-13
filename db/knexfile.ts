/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import minimist from "minimist";
import { loadSync } from "ts-import";

// Load environment variables (PGHOST, PGUSER, etc.)
const argv = minimist(process.argv.slice(2));
envars.config({ env: argv.env ?? "local" });

const { default: config } = loadSync("../api/core/db-config.ts");

export default config;
