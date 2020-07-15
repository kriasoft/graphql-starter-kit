<h1 align="center">
  <img src="https://s.tarkus.me/graphql-logo.png" width="128" height="128" alt="GraphQL" /><br>
  Node.js API Starter Kit
</h1>

<p align="center">
  <img src="https://api.dependabot.com/badges/status?host=github&repo=kriasoft/nodejs-api-starter" alt="Dependabot" height="20" />
  <a href="https://discord.com/invite/bSsv7XM"><img src="https://img.shields.io/badge/chat-discord-kriasoft.svg?logo=discord&style=flat" height="20"></a>
  <a href="https://patreon.com/koistya"><img src="https://img.shields.io/badge/donate-patreon-kriasoft.svg?logo=patreon&style=flat" height="20"></a>
  <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/nodejs-api-starter.svg?style=social&label=Star&maxAge=3600" height="20"></a>
  <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>
</p>

**Yarn v2** based monorepo template for quickly bootstrapping production ready web
application projects optimized for [serverless](https://cloud.google.com/serverless)
infrastructure, using code-first **GraphQL API** and **PostgreSQL** backend.

---

This monorepo was bootstrapped with [Node.js API Starter Kit](https://github.com/kriasoft/nodejs-api-starter).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for assistance.

## Monorepo Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`env`](./env) — environment variables used for local development<br>
`├──`[`db`](./db) — database schema and some administration tools<br>
`├──`[`api`](./api) — GraphQL API server and authentication middleware<br>
`└── ...` — add more packages such as `worker`, `web`, `mobile`, etc.

## Requirements

- [Node.js](https://nodejs.org/) v12 or higher, [Yarn](https://yarnpkg.com/) package manager
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [Postgres.app](https://postgresapp.com/), [Google Cloud SQL](https://cloud.google.com/sql))
- [VS Code](https://code.visualstudio.com/) editor with [recommended extensions](.vscode/extensions.json)

## Getting Started

Just clone the repo, tweak `.env` files inside of the [`env`](env) package and run `yarn start`:

```bash
$ npx degit https://github.com/kriasoft/nodejs-api-starter example
$ cd ./example                  # Change current directory to the newly created one
$ yarn install                  # Install Node.js dependencies
$ yarn db:reset                 # Initialize a new PostgreSQL database
$ yarn api:start                # Launch Node.js API application
```

The API server must become available at [http://localhost:8080/graphql](http://localhost:8080/graphql).

## How to Contribute

Anyone and everyone is welcome to [contribute](.github/CONTRIBUTING.md). Start
by checking out the list of [open issues](https://github.com/kriasoft/nodejs-api-starter/issues)
marked [help wanted](https://github.com/kriasoft/nodejs-api-starter/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the
[guidelines](.github/CONTRIBUTING.md).

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/nodejs-api-starter/blob/master/LICENSE) file.

---

Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@tarkus)) and [contributors](https://github.com/kriasoft/nodejs-api-starter/graphs/contributors).
