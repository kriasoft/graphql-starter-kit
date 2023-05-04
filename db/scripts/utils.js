/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/**
 * Extracts the [--env #] flag from the CLI arguments
 * @returns {[envName: string, argv: string[]]}
 */
export function getArgs() {
  const argv = process.argv.slice(3);
  let envName = "local";

  argv.forEach((val, i) => {
    if (val === "--env" && argv[i + 1]) {
      envName = argv[i + 1];
      argv.splice(i, 2);
      i -= 2;
    }

    const env = val.match(/--env=(.+)/)?.[1];

    if (env) {
      envName = env;
      argv.splice(i, 1);
      i -= 1;
    }
  });

  return [envName, argv];
}
