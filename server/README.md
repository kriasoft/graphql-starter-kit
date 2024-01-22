# GraphQL API Server

Node.js backend server with GraphQL API.

## Tech Stack

- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)**: GraphQL server library for Node.js.
- **[Pothos GraphQL](https://github.com/hayes/pothos#readme)**: Code-first GraphQL schema builder.
- **[µWebSockets](https://github.com/uNetworking/uWebSockets#readme)**: High-performance HTTP and WebSocket server.
- **[PostgreSQL](https://www.postgresql.org/)**: Database server with [vector database](https://cloud.google.com/blog/products/databases/using-pgvector-llms-and-langchain-with-google-cloud-databases) capabilities.
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)**: Real-time document database.
- **[Identity Platform](https://cloud.google.com/security/products/identity-platform)**: authentication provider by Google Cloud.
- **[Knex.js](https://knexjs.org/)**: Database client for PostgreSQL and query builder.
- **[Node.js](https://nodejs.org/)** `v20` or newer with [Yarn](https://yarnpkg.com/) package manager.
- [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), [TypeScript](https://www.typescriptlang.org/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/): development tools.

## Directory Layout

```bash
.
├── core/                       # Common application modules
├── schema/                     # GraphQL schema definitions
├── Dockerfile                  # Docker configuration for Cloud Run
├── global.d.ts                 # TypeScript definition overrides
├── graphql.ts                  # GraphQL API schema
├── index.ts                    # uWebSockets web server
├── package.json                # Node.js dependencies and scripts
├── start.ts                    # Launch script for development
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Bundler configuration
```

## Getting Started

Launch the app by running:

```bash
$ yarn workspace server start   # Or, `yarn server:start`
```

It should become available at [http://localhost:8080/](http://localhost:8080/)

## License

Copyright © 2014-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/relay-starter-kit/blob/main/LICENSE) file.
