/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import spawn from "cross-spawn";
import envars from "envars";
import minimist from "minimist";
import createDatabase from "./create";

// Parse CLI arguments
const args: string[] = [];
const { env } = minimist(process.argv.slice(2), {
  string: ["env"],
  unknown: (arg) => !args.push(arg),
});

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env });

/**
 * Launches CLI client for PostgreSQL. Usage example:
 *
 *   $ yarn psql --env=prod
 *   # \dt
 *
 * @see https://www.postgresql.org/docs/current/app-psql.html
 */
createDatabase()
  .then(() => {
    // Launch interactive terminal for working with PostgreSQL
    spawn("psql", args, { stdio: "inherit" }).on("exit", (code) => {
      if (code && code !== 0) {
        process.exitCode = 0;
      }
    });
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
