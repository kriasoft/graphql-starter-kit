# Database Schema and Tooling

Migration and seed files plus some administration scripts that help to design
a PostgreSQL database.

This project was bootstrapped with [Node.js API Starter Kit](https://github.com/kriasoft/nodejs-api-starter).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for
assistance.

## Directory Layout

```bash
.
├── backups                     # Database backup files
│   └── ...                     #   - for example "20200101T120000_dev.sql"
├── migrations                  # Database schema migration files
│   ├── 001_initial.js          #   - initial schema
│   └── ...                     #   - the reset of the migration files
├── scripts                     # Automation scripts (Knex.js REPL shell, etc.)
│   └── ...                     #   - ...
├── seeds                       # Database seed files
│   ├── 00_reset.js             #   - removes existing db records
│   ├── 01_users.js             #   - creates user accounts
│   ├── 01_users.json           #   - user accounts dataset
│   └── ...                     #   - the reset of the seed files
├── ssl                         # TLS/SSL certificates for database access
├── knexfile.js                 # Configuration file for Knex.js CLI
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## Requirements

- [Node.js](https://nodejs.org/) v12 or higher, [Yarn](https://yarnpkg.com/) package manager
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [Postgres.app](https://postgresapp.com/), [Google Cloud SQL](https://cloud.google.com/sql))
- Optionally, [`psql`](https://www.postgresql.org/docs/current/app-psql.html), [`pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html), [`pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html) client utilities (`brew install libpq` [❐](https://stackoverflow.com/a/49689589/82686))

## How to open the database

You can access the database either by using a terminal window:

```bash
$ yarn db:repl                  # Launches Knex.js REPL shell
$ yarn db:psql                  # Launches PostgreSQL REPL shell
```

Or, by using a GUI such as [Postico](https://eggerapps.at/postico/). Find
connection settings inside of the [`env`](../env) package.

Optionally pass the `--env=#0` argument with one of the pre-configured
[environments](../env) — `dev` (default), `local`, `test`, or `prod`.

## How to create a new migration

Create a new `.js` file inside of the [`migrations`](./migrations) folder,
give it a descriptive name prefixed with the migration version number, for
example `002_products.ts`. Open it in the editor, start typing `migration`
and hit `TAB` which should insert a VS Code snippet.

<p align="center"><img src="https://user-images.githubusercontent.com/197134/90134661-2aadc000-dd7a-11ea-9e66-4956f517ea95.gif" width="604" height="396" /></p>

## How to migrate database schema and data

```bash
$ yarn db:version               # Prints the current schema version to the console
$ yarn db:migrate               # Migrates database schema to the latest version
$ yarn db:seed                  # Seeds database with some reference data
```

While the app is in development, you can use a simplified migration workflow by
creating a backup of your existing database, making changes to the existing
migration file (`migrations/001_initial.ts`), re-apply the migration and restore
all the data (as opposed to re-seeding).

## How to re-apply the latest migration

```bash
$ yarn db:rollback              # Rolls back the latest migration
$ yarn db:migrate               # Migrates database schema to the latest version
$ yarn db:seed                  # Seeds database with some reference data
```

Alternatively, you can drop and re-create the database, then apply all the
outstanding migrations and seed files over again by running:

```bash
$ yarn db:reset                 # Re-creates the database; applies migrations and seeds
```

## How to backup and restore data

```bash
$ yarn db:backup                # Exports database data to a backup file
$ yarn db:restore               # Restores data from a backup file
```

You can find backup files inside of the [`/backups`](./backups) folder.

## References

- [Knex.js Migration API](https://knexjs.org/#Migrations-API)
- [Knex.js Seed API](https://knexjs.org/#Seeds-API)

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/nodejs-api-starter/blob/main/LICENSE) file.
