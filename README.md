<h1 align="center">
  <img src="https://s.tarkus.me/graphql-logo.png" width="128" height="128" alt="GraphQL" /><br>
  GraphQL API and Relay Starter Kit
  <br>
  <a href="http://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square" height="20"></a>
  <a href="http://patreon.com/koistya"><img src="https://img.shields.io/badge/dynamic/json?color=%23ff424d&label=Patreon&style=flat-square&query=data.attributes.patron_count&suffix=%20patrons&url=https%3A%2F%2Fwww.patreon.com%2Fapi%2Fcampaigns%2F233228" height="20"></a>
  <a href="https://discord.gg/gx5pdvZ7Za"><img src="https://img.shields.io/discord/643523529131950086?label=Chat&style=flat-square" height="20"></a>
  <a href="https://github.com/kriasoft/relay-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/relay-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a>
  <a href="https://twitter.com/koistya"><img src="https://img.shields.io/twitter/follow/koistya.svg?style=social&label=Follow&maxAge=3600" height="20"></a>
</h1>

## Features

- Monorepo project structure powered by Yarn with PnP
- GraphQL API using code-first development approach (TypeScript, GraphQL.js, Knex, PostgreSQL)
- Stateless JWT cookie-based authentication (supporting SSR, OAuth 2.0 via Google, Facebook, etc.)
- Database tooling — seed files, migrations, Knex.js REPL shell, etc.
- Front-end boilerplate pre-configured with TypeScript, Webpack v5, React, Relay, and Materia UI
- Serverless deployment — `api`, `img` → Cloud Functions, `web` → Cloudflare Workers
- HTML page rendering (SSR) at CDN edge locations, all ~100 points on Lighthouse
- Pre-configured dev, test / QA, production, and review (per PR) environments
- Pre-configured VSCode code snippets and other VSCode settings
- The ongoing design and development is supported by these wonderful companies:

<a href="https://reactstarter.com/s/1"><img src="https://reactstarter.com/s/1.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/2"><img src="https://reactstarter.com/s/2.png" height="60" /></a>&nbsp;&nbsp;<a href="https://reactstarter.com/s/3"><img src="https://reactstarter.com/s/3.png" height="60" /></a>

---

This project was bootstrapped with [GraphQL API Starter Kit](https://github.com/kriasoft/relay-starter-kit).
Be sure to join our [Discord channel](https://discord.com/invite/bSsv7XM) for assistance.

## Directory Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD workflows<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`env`](./env) — environment variables that are used for local development (`local`, `test`, `prod`)<br>
`├──`[`db`](./db) — database schema, seeds, and migrations ([Cloud SQL](https://cloud.google.com/sql), [Knex.js](https://knexjs.org/))<br>
`├──`[`api`](./api) — GraphQL API and authentication ([Could SQL](https://cloud.google.com/sql), [Cloud Functions](https://cloud.google.com/functions), [GraphQL.js](https://graphql.org/graphql-js/))<br>
`├──`[`img`](./img) — dynamic image resizing ([Cloud Functions](https://cloud.google.com/functions), [Cloud Storage](https://
cloud.google.com/storage))<br>
`├──`[`infra`](./infra) — cloud infrastructure configuration ([Terraform](https://www.terraform.io/))<br>
`├──`[`web`](./web) — [React](https://reactjs.org/) / [Relay](https://relay.dev/) web application with CDN rendering ([Webpack](https://webpack.js.org/), [Cloudflare Workers](https://workers.cloudflare.com/))<br>
`├──`[`scripts`](./scripts) — Automation scripts shared across the project<br>
`└── ...` — add more packages such as `worker`, `admin`, `mobile`, etc.

## Requirements

- [Node.js](https://nodejs.org/) v16, [Yarn](https://yarnpkg.com/) package manager
- Local or remote instance of [PostgreSQL](https://www.postgresql.org/) (see [Postgres.app](https://postgresapp.com/), [Google Cloud SQL](https://cloud.google.com/sql))
- [VS Code](https://code.visualstudio.com/) editor with [recommended extensions](.vscode/extensions.json)

## Getting Started

Just [clone](https://github.com/kriasoft/relay-starter-kit/generate) the repo
and run `yarn install` followed by `yarn start`:

```bash
$ git clone --origin=seed --branch=main --single-branch \
    https://github.com/kriasoft/relay-starter-kit.git example
$ cd ./example                  # Change current directory to the newly created one
$ yarn install                  # Install project dependencies
$ yarn setup                    # Configure environment variables
$ yarn db:reset                 # Create or update PostgreSQL database
$ yarn api:start                # Launch GraphQL API and authentication server
$ yarn web:start                # Launch React/Relay front-end app
```

The API server must become available at [http://localhost:8080/api](http://localhost:8080/api).<br>
The web application front-end must become available at [http://localhost:3000/](http://localhost:3000/).

## How to Deploy

Before you can deploy the app, ensure that the target
[GCP project](https://console.cloud.google.com/cloud-resource-manager) exists
and that all the environment variables (found in [`/env/*.env`](/env) files) are
up-to-date, for both `test` (QA) and `prod` (production) environments.

If you just created a brand new GCP project, you can configure it by running:

```bash
$ yarn gcp:setup --env=test
$ yarn gcp:setup --env=prod
```

OR, by using Terraform (found in [`/infra`](./infra/)), which one is more
convenient for you.

Once a new commit or PR lands onto the `main` (or, `release`) branch, it's going
to be deployed automatically using a GitHub Actions workflow. Alternatively,
you can deploy the app manually by running:

```bash
# Build and deploy the GraphQL API (GCF)
$ yarn api:build
$ yarn api:deploy --env=prod

# Build and deploy the web front-end to Cloudflare Workers (CDN)
$ yarn web:build
$ yarn web:deploy --env=prod

# Migrate the target database to the latest version
$ yarn db:migrate --env=prod
```

Where `--env=prod` is the target (production) deployment environment,
using `--env=test` when not specified.

## References

- [Getting Started with Cloud Functions (2nd gen)](https://codelabs.developers.google.com/codelabs/cloud-starting-cloudfunctions-v2)
- [Yarn 2 (Berry) - Plug'n'play, constraints and workspaces](https://www.youtube.com/watch?v=HUVawJXeHfU) by [@jherr](https://github.com/jherr)
- [Google Cloud SQL — Tips & Tricks](https://medium.com/@koistya/google-cloud-sql-tips-tricks-d0fe7106c68a?sk=fe65df6e858c9b57edbda07bc67ed0e9) by [@koistya](https://github.com/koistya)
- [Database change management with Node.js](https://dev.to/koistya/database-change-management-with-node-js-12dk) by [@koistya](https://github.com/koistya)

## How to Update

In the case when you kept the original Node.js Starter Kit git history, you can
always pull and merge updates from the "upstream" repository back into your
project by running:

```bash
$ git fetch seed                # Fetch Node.js Starter Kit (upstream) repository
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
by checking out the list of [open issues](https://github.com/kriasoft/relay-starter-kit/issues)
marked [help wanted](https://github.com/kriasoft/relay-starter-kit/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the
[guidelines](.github/CONTRIBUTING.md).

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/relay-starter-kit/blob/main/LICENSE) file.

---

<sup>Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@koistya))
and [contributors](https://github.com/kriasoft/relay-starter-kit/graphs/contributors).</sup>
