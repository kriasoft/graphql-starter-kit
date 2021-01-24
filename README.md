<h1 align="center">
  <img src="https://s.tarkus.me/graphql-logo.png" width="128" height="128" alt="GraphQL" /><br>
  Node.js API Starter Kit
</h1>

<p align="center">
  <a href="https://discord.com/invite/bSsv7XM"><img src="https://img.shields.io/badge/chat-discord-kriasoft.svg?logo=discord&style=flat" height="20"></a>
  <a href="https://github.com/sponsors/koistya"><img src="https://img.shields.io/static/v1?logo=GitHub&label=Sponsor&message=%E2%9D%A4&style=flat" height="20"></a>
  <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/nodejs-api-starter.svg?style=social&label=Star&maxAge=3600" height="20"></a>
  <a href="https://twitter.com/koistya"><img src="https://img.shields.io/twitter/follow/koistya.svg?style=social&label=Follow&maxAge=3600" height="20"></a>
</p>

**Yarn v2** based monorepo template for quickly bootstrapping production ready web
application projects optimized for [serverless](https://cloud.google.com/serverless)
infrastructure, using code-first **GraphQL API** and **PostgreSQL** backend.

---

This project was bootstrapped with [Node.js API Starter Kit](https://github.com/kriasoft/nodejs-api-starter).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for assistance.

## Directory Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`env`](./env) — environment variables used for local development<br>
`├──`[`db`](./db) — database schema and some administration tools<br>
`├──`[`api`](./api) — GraphQL API server and authentication middleware<br>
`├──`[`proxy`](./proxy) — reverse proxy implemented using [Cloudflare Workers](https://workers.cloudflare.com/)<br>
`├──`[`web`](./web) — web application project skeleton based on [React.js](https://reactjs.org/) and [Next.js](https://nextjs.org/)<br>
`├──`[`scripts`](./scripts) — Automation scripts shared across the project<br>
`└── ...` — add more packages such as `worker`, `admin`, `mobile`, etc.

## Requirements

- [Node.js](https://nodejs.org/) v12 or higher, [Yarn](https://yarnpkg.com/) package manager
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [Postgres.app](https://postgresapp.com/), [Google Cloud SQL](https://cloud.google.com/sql))
- [VS Code](https://code.visualstudio.com/) editor with [recommended extensions](.vscode/extensions.json)

## Getting Started

Just clone the repo and run `yarn setup` followed by `yarn start`:

```bash
$ git clone --origin=upstream --branch=main --single-branch \
    https://github.com/kriasoft/nodejs-api-starter.git example
$ cd ./example                  # Change current directory to the newly created one
$ yarn install                  # Install project dependencies
$ yarn setup                    # Configure environment variables
$ yarn start                    # Launch Node.js API and web application
```

The API server must become available at [http://localhost:8080/graphql](http://localhost:8080/graphql).<br>
The web application front-end must become available at [http://localhost:3000/](http://localhost:3000/).

## References

- [Yarn 2 (Berry) - Plug'n'play, constraints and workspaces](https://www.youtube.com/watch?v=HUVawJXeHfU) by [@jherr](https://github.com/jherr)
- [Google Cloud SQL — Tips & Tricks](https://medium.com/@koistya/google-cloud-sql-tips-tricks-d0fe7106c68a?sk=fe65df6e858c9b57edbda07bc67ed0e9) by [@koistya](https://github.com/koistya)
- [Database change management with Node.js](https://dev.to/koistya/database-change-management-with-node-js-12dk) by [@koistya](https://github.com/koistya)

## How to Update

In the case when you kept the original Node.js Starter Kit git history, you can
always pull and merge updates from the "upstream" repository back into your
project by running:

```bash
$ git fetch upstream            # Fetch Node.js Starter Kit (upstream) repository
$ git checkout main             # Switch to the main branch (or, master branch)
$ git merge upstream/main       # Merge upstream/master into the local branch
```

In order to update Yarn and other dependencies to the latest versions, run:

```bash
$ yarn set version latest       # Upgrade Yarn CLI to the latest version
$ yarn upgrade-interactive      # Bump Node.js dependencies using an interactive mode
$ yarn install                  # Install the updated Node.js dependencies
$ yarn pnpify --sdk vscode      # Update VSCode settings
```

## How to Contribute

Anyone and everyone is welcome to [contribute](.github/CONTRIBUTING.md). Start
by checking out the list of [open issues](https://github.com/kriasoft/nodejs-api-starter/issues)
marked [help wanted](https://github.com/kriasoft/nodejs-api-starter/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the
[guidelines](.github/CONTRIBUTING.md).

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/nodejs-api-starter/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/nodejs-api-starter/graphs/contributors).</sup>
