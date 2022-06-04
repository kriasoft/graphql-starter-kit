# GraphQL API Server

GraphQL API server implemented using code-first development approach and
optimized for hosting in a [serverless](https://cloud.google.com/serverless)
environment such as [Google Cloud Functions](https://cloud.google.com/functions)
or [Google Cloud Run](https://cloud.google.com/run).

---

This project was bootstrapped with [GraphQL API Starter Kit](https://github.com/kriasoft/relay-starter-kit).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for
assistance.

## Tech Stack

- [Node.js](https://nodejs.org/) `v16`, [Yarn](https://yarnpkg.com/), [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) — core platform and dev tools
- [GraphQL.js](https://github.com/graphql/graphql-js), [GraphQL.js Relay](https://github.com/graphql/graphql-relay-js), [DataLoader](https://github.com/graphql/dataloader), [Validator.js](https://github.com/validatorjs/validator.js) — [GraphQL](https://graphql.org/) schema and API endpoint(s)
- [PostgreSQL](https://www.postgresql.org/), [Knex.js](https://knexjs.org/), [`pg`](https://node-postgres.com/), [`@google-cloud/storage`](https://googleapis.dev/nodejs/storage/latest) — data access
- [`jose`](https://github.com/panva/jose), [`google-auth-library`](https://github.com/googleapis/google-auth-library-nodejs) — stateless JWT-based sessions and authentication
- [Jest](https://jestjs.io/) - unit and snapshot testing

```bash
.
├── auth/                       # Authentication middleware
├── core/                       # Common application modules
├── db/                         # PostgreSQL client and query builder
├── mutations/                  # GraphQL API mutation endpoints
├── queries/                    # Top-level GraphQL API query fields
├── types/                      # GrapHQL API schema types
├── utils/                      # Helper / utility functions
├── views/                      # Handlebar views
├── context.ts                  # GraphQL API context variable(s)
├── env.ts                      # Environment variables validator
├── errors.ts                   # Application errors middleware
├── global.d.ts                 # TypeScript definition overrides
├── graphql.ts                  # GraphQL API schema
├── index.ts                    # Node.js / Express server
├── package.json                # Node.js dependencies
├── rollup.config.js            # Rollup bundler configuration
├── schema.graphql              # GraphQL schema (auto-generated)
└── tsconfig.json               # TypeScript configuration
```

## Requirements

- [Node.js](https://nodejs.org/) v16 or higher, [Yarn](https://yarnpkg.com/) package manager
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [Postgres.app](https://postgresapp.com/), [Google Cloud SQL](https://cloud.google.com/sql))
- [VS Code](https://code.visualstudio.com/) editor (highly recommended)

## Getting Started

Ensure that the database schema and data is up-to-date by running:

```bash
$ yarn db:reset                 # Re-creates the database and applies migrations and seeds
```

Launch the app in development mode:

```bash
$ yarn api:start                # Launch the API server on http://localhost:8080/
$ yarn api:start-debug          # Alternatively, launch it with a debugger (chrome inspector)
```

Optionally pass the `--env=#0` argument with one of the pre-configured
[environments](../env) — `dev` (default), `local`, `test`, or `prod`.

The app must become available on [`http://localhost:8080/api`](http://localhost:8080/api).

## How to Test

```bash
$ yarn g:lint [--no-cache]      # Lint code with ESLint
$ yarn g:test                   # Run unit tests with Jest
$ yarn tsc                      # Check the code for type errors using TypeScript
```

## How to Debug

Use `yarn start-debug` instead of `yarn start` then attach VS Code debugger to
the running instance of the app.

## How to Deploy

```
$ yarn api:build
$ yarn api:deploy [--version #0] [--env #0]
```
