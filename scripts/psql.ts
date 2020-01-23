/**
 * PostgreSQL REPL shell (try running `yarn psql --env=?`)
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import cp from 'child_process';

// Load environment variables (PGHOST, PGUSER, etc.)
import '../knexfile';

// Ensure that the SSL key file has correct permissions
if (process.env.PGSSLKEY) {
  cp.spawnSync('chmod', ['0600', process.env.PGSSLKEY], { stdio: 'inherit' });
}

// Launch interactive terminal for working with Postgres
cp.spawn('psql', { stdio: 'inherit' });
