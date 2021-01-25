# GraphQL API Server

GraphQL API server implemented using code-first development approach and
optimized for hosting in a [serverless](https://cloud.google.com/serverless)
environment such as [Google Cloud Functions](https://cloud.google.com/functions)
or [Google Cloud Run](https://cloud.google.com/run).

---

This project was bootstrapped with [Node.js API Starter Kit](https://github.com/kriasoft/nodejs-api-starter).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for
assistance.

## Tech Stack

- [Node.js](https://nodejs.org/) `v12`, [Yarn](https://yarnpkg.com/) `v2`, [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) — core platform and dev tools
- [GraphQL.js](https://github.com/graphql/graphql-js), [GraphQL.js Relay](https://github.com/graphql/graphql-relay-js), [DataLoader](https://github.com/graphql/dataloader), [Validator.js](https://github.com/validatorjs/validator.js) — [GraphQL](https://graphql.org/) schema and API endpoint(s)
- [PostgreSQL](https://www.postgresql.org/), [Knex.js](https://knexjs.org/), [`pg`](https://node-postgres.com/), [`@google-cloud/storage`](https://googleapis.dev/nodejs/storage/latest) — data access
- [`jswonwebtoken`](https://github.com/auth0/node-jsonwebtoken), [`google-auth-library`](https://github.com/googleapis/google-auth-library-nodejs) — stateless JWT-based sessions and authentication
- [Jest](https://jestjs.io/) - unit and snapshot testing

```bash
.
├── auth/                       # Authentication middleware
├── enums/                      # GraphQ enumeration types
├── mutations/                  # GraphQL API mutation endpoints
├── queries/                    # The top-level GraphQL API query fields
├── types/                      # GrapHQL API schema types
├── utils/                      # Helper functions
├── context.ts                  # GraphQL API context variable(s)
├── db.ts                       # PostgreSQL client and query builder
├── errors.ts                   # Custom error types
├── fields.ts                   # Helper functions for GraphQL fields
├── index.ts                    # GraphQL API server entry point
├── node.ts                     # GraphQL Relay Node interface
├── package.json                # Node.js dependencies
├── schema.graphql              # Auto-generated GraphQL API schema
├── schema.ts                   # GraphQL API schema definition
├── server.js                   # Application launcher for local development
├── session.ts                  # Stateless JWT-based session middleware
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
$ yarn g:lint [--no-cache]      # Lint code with ESLint
$ yarn g:test                   # Run unit tests with Jest
$ yarn tsc                      # Check the code for type errors using TypeScript
```

## How to Debug

Use `yarn start-debug` instead of `yarn start` then attach VS Code debugger to
the running instance of the app.

## How to Deploy

Compile and bundle the code into the `dist/api.zip` file (`yarn build`), upload
it to Google Cloud Storage (`yarn push`), and finally, deploy or re-deploy
the Google Cloud Function straight from GCS (`yarn deploy`).

```
$ yarn api:build
$ yarn api:push [--version=#0]
$ yarn api:deploy [--version=#0] [--env=#1]
```

**NOTE**: These three separate steps are necessary in order to optimize the CI/CD
workflows (see `.github/workflows`).

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/nodejs-api-starter/blob/main/LICENSE) file.
