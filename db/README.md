# Database Schema and Tooling

Migration and seed files plus some administration scripts that help to design
a PostgreSQL database.

## Directory Layout

```bash
.
├── backups                     # Database backup files
│   └── ...                     #   - for example "20200101T120000_local.sql"
├── migrations                  # Database schema migration files
│   ├── 001_initial.ts          #   - initial schema
│   └── ...                     #   - the reset of the migration files
├── scripts                     # Automation scripts (Knex.js REPL shell, etc.)
│   └── ...                     #   - ...
├── seeds                       # Database seed files
│   ├── 00_reset.ts             #   - removes existing db records
│   ├── 01_users.json           #   - user accounts dataset
│   ├── 01_users.ts             #   - creates user accounts
│   ├── 02_identities.json      #   - user accounts dataset
│   ├── 02_identities.ts        #   - creates user accounts
│   └── ...                     #   - the reset of the seed files
├── ssl                         # TLS/SSL certificates for database access
├── knexfile.ts                 # Configuration file for Knex.js CLI
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## Requirements

- [Node.js](https://nodejs.org/) v16 or newer, [Yarn](https://yarnpkg.com/) package manager
- The local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [`postgresql`](https://formulae.brew.sh/formula/postgresql), [Google Cloud SQL](https://cloud.google.com/sql))
- Optionally, [`psql`](https://www.postgresql.org/docs/current/app-psql.html), [`pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html), [`pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html) client utilities (`brew install libpq` [❐](https://stackoverflow.com/a/49689589/82686))

## How to access the database

You can access the database either by using a terminal window:

```
$ yarn db:repl [--env #0]       # Launches Knex.js REPL shell
$ yarn db:psql [--env #0]       # Launches PostgreSQL REPL shell
```

Or, by using a GUI such as [Postico](https://eggerapps.at/postico/). Find
connection settings inside of the [`env`](../env) package.

Optionally pass the `--env #0` argument with one of the pre-configured
[environments](../env) — `local` (default), `test`, or `prod`. For example:

```
$ yarn db:repl --env=prod
```

## How to create a new migration

Create a new `.ts` file inside of the [`migrations`](./migrations) folder,
give it a descriptive name prefixed with the migration version number, for
example `002_products.ts`. Open it in the editor, start typing `migration`
and hit `TAB` which should insert a VS Code snippet.

<p align="center"><img src="https://github.com/koistya/files/blob/gh-pages/db-migration.gif?raw=true" width="679" height="501" /></p>

## How to reset the database schema and data

As a simplified db migration strategy, you can run `yarn db:reset` script that
drops the default (`public`) db schema, re-applies the migration, optionally
restores data from a backup file, and reseeds the database.

```
$ yarn db:reset [--env #0] [--no-seed]
```

This approach works well during local development, or before the app was
released to production. This way you can even make changes to the existing
migration files (e.g. [`001_initial.ts`](./migrations/001_initial.ts)), as
opposed to creating a new migration file per each database schema change.

If you want to reset the database AND keep all the data, you would just need
to create a backup file first, then run `yarn db:reset` with `--restore` flag.

```
$ yarn db:backup
$ yarn db:reset --restore
```

or, if you want to restore data from the test/QA database:

```
$ yarn db:backup --env=test
$ yarn db:reset --env=local --restore=test
```

## How to migrate the database schema and data

For a more granular control over schema changes, create a new migration file per
each database modification and apply the last batch of migration file(s) by running:

```
$ yarn db:version [--env #0]    # Prints the current schema version to the console
$ yarn db:migrate [--env #0]    # Migrates database schema to the latest version
$ yarn db:seed [--env #0]       # Seeds database with sample/reference data
```

## How to rollback the latest migration

```
$ yarn db:rollback [--env #0]   # Rolls back the latest migration
```

## How to backup and restore data

```
$ yarn db:backup [--env #0]     # Create data (only) backup of the target database
$ yarn db:restore [--env #0] [--from #0]
```

You can find backup files inside of the [`/backups`](./backups) folder.

## How to generate fake (reference) data

You can generate and populate the database with some fake (but reasonable) data
that can be used for unit testing, performance testing, demos, etc.

```
$ yarn db:generate [--env #0]
```

See [`/scripts/generate.ts`](./scripts/generate.ts) script file.

You can also import data from the database into [`/seeds/*.json`](./seeds))
files by running:

```
$ yarn db:import-seeds [--env #0]
```

## References

- [Knex.js Migration API](https://knexjs.org/#Migrations-API)
- [Knex.js Seed API](https://knexjs.org/#Seeds-API)

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/relay-starter-kit/blob/main/LICENSE) file.
