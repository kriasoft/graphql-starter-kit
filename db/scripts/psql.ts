/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { spawn } from "cross-spawn";
import envars from "envars";
import { createDatabase } from "./create";
import { getArgs } from "./utils";

/**
 * Launches CLI client for PostgreSQL. Usage example:
 *
 *   $ yarn psql --env=prod
 *   # \dt
 *
 * https://www.postgresql.org/docs/current/app-psql.html
 */
(async function () {
  // Parse CLI arguments
  const [envName, argv] = getArgs();

  // Load environment variables (PGHOST, PGUSER, etc.)
  envars.config({ env: envName });

  // Ensure that the database exists before proceeding
  await createDatabase({ silent: true });

  // Launch PostgreSQL Shell
  spawn("psql", argv, { stdio: "inherit" }).on("exit", (code) => {
    process.exitCode = code ?? undefined;
  });
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
