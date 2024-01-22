<h1 align="center">
  <img src="https://s.tarkus.me/graphql-logo.png" width="128" height="128" alt="GraphQL" /><br>
  GraphQL Starter Kit
  <br>
  <a href="http://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square" height="20"></a>
  <a href="http://patreon.com/koistya"><img src="https://img.shields.io/badge/dynamic/json?color=%23ff424d&label=Patreon&style=flat-square&query=data.attributes.patron_count&suffix=%20patrons&url=https%3A%2F%2Fwww.patreon.com%2Fapi%2Fcampaigns%2F233228" height="20"></a>
  <a href="https://discord.gg/gx5pdvZ7Za"><img src="https://img.shields.io/discord/643523529131950086?label=Chat&style=flat-square" height="20"></a>
  <a href="https://github.com/kriasoft/graphql-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/graphql-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a>
  <a href="https://twitter.com/koistya"><img src="https://img.shields.io/twitter/follow/koistya.svg?style=social&label=Follow&maxAge=3600" height="20"></a>
</h1>

High-performance GraphQL API server and React front-end.

## Features

- [Monorepo](https://yarnpkg.com/features/workspaces) project structure powered by [Yarn](https://yarnpkg.com/) with [PnP](https://yarnpkg.com/features/pnp).
- [GraphQL API](https://graphql.org/) powered by [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) and [Pothos GraphQL](https://pothos-graphql.dev/).
- Authentication and authorization powered by [Google Identity Platform](https://cloud.google.com/identity-platform).
- Database tooling — seed files, migrations, [Knex.js](https://knexjs.org/) REPL shell, etc.
- Front-end boilerplate pre-configured with [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [React](https://beta.reactjs.org/), and [Joy UI](https://mui.com/joy-ui/getting-started/).
- Pre-configured dev, test / QA, production, and preview environments.
- Pre-configured VSCode code snippets and other [VSCode](https://code.visualstudio.com/) settings.
- The ongoing design and development is supported by these wonderful companies:

<a href="https://reactstarter.com/s/1"><img src="https://reactstarter.com/s/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/2"><img src="https://reactstarter.com/s/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/3"><img src="https://reactstarter.com/s/3.png" height="60" /></a>

---

This project was bootstrapped with [GraphQL Starter Kit](https://github.com/kriasoft/graphql-starter-kit).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for assistance.

## Directory Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD workflows.<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`app`](./app) — front-end application ([Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), [React](https://reactjs.org/)).<br>
`├──`[`db`](./db) — database schema, seeds, and migrations ([PostgreSQL](https://www.postgresql.org/)).<br>
`├──`[`infra`](./infra) — cloud infrastructure configuration ([Terraform](https://www.terraform.io/)).<br>
`├──`[`scripts`](./scripts) — automation scripts shared across the project.<br>
`├──`[`server`](./server) — backend server ([GraphQL Yoga](https://the-guild.dev/graphql/yoga-server), [Pothos GraphQL](https://pothos-graphql.dev/)).<br>
`└── ...` — add more packages such as `worker`, `admin`, `mobile`, etc.

## Requirements

- [Node.js](https://nodejs.org/) v20 or newer with [Corepack](https://nodejs.org/api/corepack.html) enabled.
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/).
- [VS Code](https://code.visualstudio.com/) editor with [recommended extensions](.vscode/extensions.json).

## Getting Started

Just [clone](https://github.com/kriasoft/graphql-starter-kit/generate) the repo
and, install project dependencies and bootstrap the PostgreSQL database:

```bash
$ git clone https://github.com/kriasoft/graphql-starter-kit.git example
$ cd ./example                  # Change current directory to the newly created one
$ corepack enable               # Ensure Yarn is installed
$ yarn install                  # Install project dependencies
$ yarn db create                # Create a new database if doesn't exist
$ yarn db migrate --seed        # Migrate and seed the database
```

From there on, you can launch the app by running:

```bash
$ yarn workspace server start   # Or, `yarn server:start`
$ yarn workspace app start      # Or, `yarn app:start`
```

The GraphQL API server should become available at [http://localhost:8080/](http://localhost:8080/).<br>
While the front-end server should be running at [http://localhost:5173/](http://localhost:5173/).

**IMPORTANT**: Tap `Shift`+`Cmd`+`P` in VSCode, run the **TypeScript: Select TypeScript Version** command and select the workspace version.

## How to Update

In the case when you kept the original GraphQL Starter Kit git history, you can
always pull and merge updates from the "seed" repository back into your
project by running:

```bash
$ git fetch seed                # Fetch GraphQL Starter Kit (seed) repository
$ git checkout main             # Switch to the main branch (or, master branch)
$ git merge seed/main           # Merge upstream/master into the local branch
```

In order to update Yarn and other dependencies to the latest versions, run:

```bash
$ yarn set version latest       # Upgrade Yarn CLI to the latest version
$ yarn upgrade-interactive      # Bump Node.js dependencies using an interactive mode
$ yarn install                  # Install the updated Node.js dependencies
$ yarn dlx @yarnpkg/sdks vscode # Update VSCode settings
```

## Backers

<a href="https://reactstarter.com/b/1"><img src="https://reactstarter.com/b/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/2"><img src="https://reactstarter.com/b/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/3"><img src="https://reactstarter.com/b/3.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/4"><img src="https://reactstarter.com/b/4.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/5"><img src="https://reactstarter.com/b/5.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/6"><img src="https://reactstarter.com/b/6.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/7"><img src="https://reactstarter.com/b/7.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/b/8"><img src="https://reactstarter.com/b/8.png" height="60" /></a>

## How to Contribute

Anyone and everyone is welcome to [contribute](.github/CONTRIBUTING.md). Start
by checking out the list of [open issues](https://github.com/kriasoft/graphql-starter-kit/issues)
marked [help wanted](https://github.com/kriasoft/graphql-starter-kit/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the
[guidelines](.github/CONTRIBUTING.md).

## License

Copyright © 2014-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/graphql-starter-kit/blob/main/LICENSE) file.
