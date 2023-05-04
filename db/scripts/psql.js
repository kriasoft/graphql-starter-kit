/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa } from "execa";
import { createDatabase } from "./create.js";
import { getArgs } from "./utils.js";

/**
 * Launches CLI client for PostgreSQL. Usage example:
 *
 *   $ yarn psql --env=prod
 *   # \dt
 *
 * https://www.postgresql.org/docs/current/app-psql.html
 */

// Parse CLI arguments
const [envName, argv] = getArgs();

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: envName });

// Ensure that the database exists before proceeding
await createDatabase({ silent: true });

// Launch PostgreSQL Shell
await execa("psql", argv, { stdio: "inherit" });
