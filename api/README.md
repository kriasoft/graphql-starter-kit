# GraphQL API Server

GraphQL API server implemented using code-first development approach and
optimized for hosting in a [serverless](https://cloud.google.com/serverless)
environment such as [Google Cloud Functions](https://cloud.google.com/functions)
or [Google Cloud Run](https://cloud.google.com/run).

This project was bootstrapped with [Node.js API Starter Kit](https://github.com/kriasoft/nodejs-api-starter).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) if you
need some help.

## Tech Stack

- [Node.js](https://nodejs.org/) `v12`, [Yarn](https://yarnpkg.com/) `v2`, [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) — core platform and dev tools
- [GraphQL.js](https://github.com/graphql/graphql-js), [GraphQL.js Relay](https://github.com/graphql/graphql-relay-js), [DataLoader](https://github.com/graphql/dataloader), [Validator.js](https://github.com/validatorjs/validator.js) — [GraphQL](https://graphql.org/) schema and API endpoint(s)
- [PostgreSQL](https://www.postgresql.org/), [Knex](https://knexjs.org/), [pg](https://node-postgres.com/), [GCP Storage](https://cloud.google.com/storage) — data access
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - stateless authentication via 3rd party providers (Google, Apple, etc.)
- [Jest](https://jestjs.io/) - unit and snapshot testing

```bash
.
├── scripts                     # Automation scripts
│   ├── update-schema.ts        #   - generates `schema.graphql` file
│   └── update-types.ts         #   - generates TypeScript definitions
├── src                         #
│   ├── mutations               # GraphQL API mutation endpoints
│   ├── queries                 # The top-level GraphQL API query fields
│   ├── types                   # GrapHQL API schema types
│   ├── utils                   # Helper functions
│   ├── auth.ts                 # Authentication middleware
│   ├── context.ts              # GraphQL API context variable(s)
│   ├── db.ts                   # PostgreSQL client and query builder
│   ├── errors.ts               # Custom error types
│   ├── fields.ts               # Helper functions for GraphQL fields
│   ├── index.ts                # GraphQL API server entry point
│   ├── node.ts                 # GraphQL Relay Node interface
│   ├── schema.ts               # GraphQL API schema definition
│   └── validator.ts            # User input validator
├── babel.config.js             # Babel.js configuration
├── package.json                # Node.js dependencies
├── README.md                   # This file
├── schema.graphql              # Auto-generated GraphQL API schema
└── tsconfig.json               # TypeScript configuration
```

## Requirements

- [Node.js](https://nodejs.org/) v12 or higher, [Yarn](https://yarnpkg.com/) package manager
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [Postgres.app](https://postgresapp.com/), [Google Cloud SQL](https://cloud.google.com/sql))
- [VS Code](https://code.visualstudio.com/) editor (highly recommended)

## Getting Started

Ensure that the database schema and data is up-to-date by running:

```bash
$ yarn db:reset                 # Re-creates the database and applies migrations and seeds
```

Launch the app in development mode (using [Nodemon](https://github.com/remy/nodemon)):

```bash
$ yarn api:start                # Launch the API server on http://localhost:8080/
$ yarn api:start-debug          # Alternatively, launch it with a debugger (chrome inspector)
```

Optionally pass the `--env=#0` argument with one of the pre-configured
[environments](../env) — `dev` (default), `local`, `test`, or `prod`.

The app must become available on [`http://localhost:8080/graphql`](http://localhost:8080/graphql).

## How to Test

```bash
$ yarn g:lint .                 # Lint the code in the selected folder using ESLint
$ yarn tsc                      # Check the code for type errors using TypeScript
$ yarn test                     # Run unit tests with Jest
```

## How to Debug

Use `yarn start-debug` instead of `yarn start` then attach VS Code debugger to
the running instance of the app.

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/nodejs-api-starter/blob/master/LICENSE) file.
