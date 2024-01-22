# Database Schema and Administration Tools

This folder contains database schema migration files, seed files, and administration tools for the [PostgreSQL](https://www.postgresql.org/) database.

## Directory Layout

```bash
.
├── backups                     # Database backup files
│   └── ...                     #   - for example "20240101T120000Z.sql"
├── migrations                  # Database schema migration files
│   ├── 001_initial.ts          #   - initial schema
│   └── ...                     #   - the reset of the migration files
├── models                      # Data models and Zod validators (generated)
│   ├── User.ts                 #   - User model
│   ├── Workspace.ts            #   - Workspace model
│   └── ...                     #   - the reset of the data models
├── seeds                       # Database seed files
│   ├── 01-users.ts             #   - user account
│   ├── 02-workspaces.ts        #   - user workspaces
│   └── ...                     #   - the reset of the seed files
├── ssl                         # TLS/SSL certificates for database access
├── cli.ts                      # Database administration CLI
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## Tech Stack

- **[PostgreSQL](https://www.postgresql.org/)**: db server with vector database capabilities.
- **[CloudSQL Node.js Connector](https://github.com/GoogleCloudPlatform/cloud-sql-nodejs-connector#readme)**: secure tunnel connection to [Cloud SQL](https://cloud.google.com/sql/postgresql).
- **[Knex.js](https://knexjs.org/)**: database client and schema migration tools.
- **[Kanel](https://github.com/kristiandupont/kanel#readme)**: generates TypeScript types from a database.
- **[Commander](https://github.com/tj/commander.js#readme)**: Command-line interface builder.
- **[Node.js](https://nodejs.org/)** with [TypeScript](https://www.typescriptlang.org/) and [Yarn](https://yarnpkg.com/) package manager.

## Getting Started

Ensure that you have the recent version of PostgreSQL installed on your machine as well as `psql` and `pg_dump` client utilities. On macOS, you can install them using [Homebrew](https://brew.sh/):

```bash
$ brew update
$ brew install postgresql libpq
$ brew services start postgresql
```

You may need a GUI tool such as [Postico](https://eggerapps.at/postico/) to access the database.

Once the PostgreSQL server is up and running, you can update the database connection settings inside of the [`.env`](../.env) (or, `.env.local`) file and bootstrap the database (schema and data) by running:

```bash
$ yarn db --version         # Check current database version
$ yarn db create            # Create a new database
$ yarn db migrate --seed    # Run all migrations and seeds
$ yarn db types             # Generate TypeScript types
```

To see all available commands, run `yarn db --help`:

```
Usage: db [options] [command]

Database management CLI for PostgreSQL

Options:
  -i, --interactive   launch interactive terminal with Knex.js
  --env <env>         target environment (e.g. prod, staging, test)
  -v, --version       current database and migration versions
  --schema <schema>   database schema (default: "public")
  -h, --help          display help for command

Commands:
  create [options]    create a new database if doesn't exist
  migrate [options]   run all migrations that have not yet been run
  rollback [options]  rollback the last batch of migrations performed
  backup [options]    create a backup of the database data
  restore [options]   restore database data from a backup file
  types [options]     generate TypeScript types from a live db
  psql [options]      launch PostgreSQL interactive terminal
```

In order to create a new migration, create a new `<ver>_<name>.ts` file inside of the [`migrations`](./migrations) folder, give it a descriptive name prefixed with the migration version number, for example `002_products.ts`. Open it in the editor, start typing `migration` and hit `Tab` key which should insert the following VS Code snippet:

<p align="center"><img src="https://github.com/koistya/files/blob/gh-pages/db-migration.gif?raw=true" width="679" height="501" /></p>

To apply the migration, run:

```
$ yarn db migrate [--env <name>] [--seed]
```

If you need to rollback the migration, run:

```
$ yarn db rollback [--env <name>] [--all]
```

## License

Copyright © 2014-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/relay-starter-kit/blob/main/LICENSE) file.
