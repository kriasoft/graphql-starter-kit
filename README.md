# Node.js API Starter Kit &nbsp; <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/nodejs-api-starter.svg?style=social&label=Star&maxAge=3600" height="20"></a> <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

Boilerplate and tooling for authoring **data API** backends with **[Node.js][node]** and
**[GraphQL][gql]**. It's meant to be paired with a web and/or mobile application project such as
[React Starter Kit][rsk].

#### This project is maintained with support from <a href="https://rollbar.com/?utm_source=reactstartkit(github)&utm_medium=link&utm_campaign=reactstartkit(github)"><img src="https://koistya.github.io/files/rollbar-247x48.png" height="24" align="top" /></a> <a href="https://x-team.com/?utm_source=reactstarterkit&utm_medium=github-link&utm_campaign=reactstarterkit-june"><img src="https://koistya.github.io/files/xteam-168x48.png" height="24" align="top" /></a><sup><a href="https://x-team.com/join/?utm_source=reactstarterkit&utm_medium=github-link&utm_campaign=reactstarterkit-june">Hiring</a></sup>

✓ Cross-platform development on macOS, Windows or Linux inside [Docker][docker]<br>
✓ [GraphQL][gql] boilerplate, everything needed to get started building a [GraphQL][gql] API service or gateway<br>
✓ [PostgreSQL][pg] database schema boilerplate and migration tools (see [`tools`](./tools), [`migrations`](./migrations))<br>
✓ Authentication and authorization via [Passport.js][passport] (see [`src/passport.js`](./src/passport.js), [`src/routes/account.js`](./src/routes/account.js))<br>
✓ Session and cache management with [Redis][redis] and [DataLoader][loader] (see [stop using JWT for sessions](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/))<br>
✓ Email templates for sending transactional email (see [`src/emails`](./src/emails), [`src/email.js`](./src/email.js))<br>
✓ **24/7** community support on [Gitter][gitter] + *premium support* on [Skype][skype] ([book a session](https://calendly.com/koistya))<br>


---

This project was bootstraped with [Node.js API Starter Kit][nodejskit] ([support][gitter]).

<p align="center"><a href="https://graphql-demo.kriasoft.com"><img src="http://koistya.github.io/files/nodejs-api-starter-demo.png" width="600" alt="GraphQL Demo" /><br><sup>https://graphql-demo.kriasoft.com</sup></a></p>


## Directory Layout

```bash
.
├── /build/                     # The compiled output (via Babel)
├── /config/                    # Configuration files (for Docker containers etc.)
├── /locales/                   # Localization resources (i18n)
├── /migrations/                # Database schema migrations
├── /seeds/                     # Scripts with reference/sample data
├── /src/                       # Node.js application source files
│   ├── /emails/                # Handlebar templates for sending transactional email
│   ├── /routes/                # Express routes, e.g. /login/facebook
│   ├── /schema/                # GraphQL schema, types, fields and mutations
│   │   ├── /Node.js            # Relay's "node" definitions
│   │   ├── /User.js            # User related top-level fields and mutations
│   │   ├── /UserType.js        # User type, representing a user account (id, emails, etc.)
│   │   ├── /...                # etc.
│   │   └── /index.js           # Exports GraphQL schema object
│   ├── /app.js                 # Express.js application
│   ├── /DataLoaders.js         # Data access utility for GraphQL /w batching and caching
│   ├── /db.js                  # Database access and connection pooling (via Knex)
│   ├── /email.js               # Client utility for sending transactional email
│   ├── /passport.js            # Passport.js authentication strategies
│   ├── /redis.js               # Redis client
│   └── /server.js              # Node.js server (entry point)
├── /test/                      # Unit, integration and load tests
├── /tools/                     # Build automation scripts and utilities
├── docker-compose.yml          # Defines Docker services, networks and volumes
├── docker-compose.override.yml # Overrides per developer environment (not under source control)
├── Dockerfile                  # Commands for building a Docker image for production
└── package.json                # The list of project dependencies
```


## Prerequisites

* [Docker][docker] Community Edition v17 or higher
* [VS Code][code] editor (preferred) + Project Snippets, EditorConfig, ESLint and Flow plug-ins.


## Getting Started

Just clone the repo and run `docker-compose up`:

```bash
git clone https://github.com/kriasoft/nodejs-api-starter.git example-api
cd example-api                  # Change current directory to the newly created one
docker-compose up               # Launch Docker containers with the Node.js API app running inside
yarn docker-db-seed             # Seed the database with some test data
```

The API server must become available at [http://localhost:8080/graphql](http://localhost:8080/graphql)
([live demo][demo]).

Once the Docker container named `api` is started, the Docker engine executes `node tools/run.js`
command that installs Node.js dependencies, migrates database schema to the latest version,
compiles Node.js app from source files (see [`src`](./src)) and launches it with "live reload"
on port `8080`.

If you need to manually rollback and re-apply the latest database migration file, run the following:

```bash
yarn docker-db-rollback         # Rollbacks the latest migration
yarn docker-db-migrate          # Migrates database to the latest version (see /migrates folder)
yarn docker-db-seed             # Seeds database with test data (see /seeds folder)
```

In order to open a shell from inside the running "api" container, run:

```bash
docker-compose exec api /bin/sh
```

Similarly, if you need to open a PostgreSQL shell ([psql][psql]), execute this command:

```bash
docker-compose exec db psql <db> -U postgres
```

For the full list of automation scripts available in this project, please reffer to "scripts"
section in the [`package.json`](./package.json) file and the [`tools`](./tools) folder.


## Testing

```bash
yarn lint                       # Find problematic patterns in code
yarn check                      # Check source code for type errors
yarn docker-test                # Run unit tests once inside a Docker container
yarn docker-test-watch          # Run unit tests in watch mode inside a Docker container
```


## Debugging

In order to run the app with [V8 inspector][v8debug] enabled, simply replace `node tools/run.js`
with `node --inspect tools/run.js` in either [`docker-compose.yml`](docker-compose.yml) file, or
even better in `docker-compose.override.yml`. Then restart the app (`docker-compose up`) and
[attach your debugger][vsdebug] to `127.0.0.1:9230` (see [`.vscode/launch.json`](https://gist.github.com/koistya/421ea3e0139225b27f909e98202a34de)
for [VS Code][code] as an example).


## Keeping Up-to-Date

If you keep the original Git history after clonning this repo, you can always fetch and merge
the recent updates back into your project by running:

```bash
git remote add nodejs-api-starter https://github.com/kriasoft/nodejs-api-starter.git
git checkout master
git fetch nodejs-api-starter
git merge nodejs-api-starter/master
docker-compose up
```

*NOTE: Try to merge as soon as the new changes land on the master branch in Node.js API Starter
repository, otherwise your project may diverse too much from the base/upstream repo.*


## Deployment

Customize the deployment script found in `tools/publish.js` if needed. Then whenever you need to
deploy your app to a remote server simply run:

```bash
node tools/publish <host>       # where <host> is the name of your web server (see ~/.ssh/config)
```

Not sure where to deploy your app? [DigitalOcean][do] is a great choice in many cases (get [$10 credit][do])


## Contributing

Anyone and everyone is welcome to [contribute](CONTRIBUTING.md). Start by checking out the list of
[open issues](https://github.com/kriasoft/nodejs-api-starter/issues) marked
[help wanted](https://github.com/kriasoft/nodejs-api-starter/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the [guidelines](CONTRIBUTING.md).


## Books and Tutorials

[![Docker in Action](https://images-na.ssl-images-amazon.com/images/I/518L63vGMpL._SL160_.jpg)](http://amzn.to/2hmUrNP)
[![You Don't Know JS](https://images-na.ssl-images-amazon.com/images/I/B172ZcXnYDS._SL160_.png)](http://amzn.to/2idQ3gL)
[![JavaScript Ninja](https://images-na.ssl-images-amazon.com/images/I/51tQ+JAczgL._SL160_.jpg)](http://amzn.to/2idDamK)
[![Effective JavaScript](https://images-na.ssl-images-amazon.com/images/I/51W25NBDLQL._SL160_.jpg)](http://amzn.to/2idMZBq)
[![NodeSchool.io](http://koistya.github.io/files/nodeschool.jpg)](https://nodeschool.io/)

## Related Projects

* [GraphQL.js](https://github.com/graphql/graphql-js) — The JavaScript reference implementation for [GraphQL](http://graphql.org/)
* [DataLoader](https://github.com/facebook/dataloader) — Batching and caching for GraphQL data access layer
* [React Starter Kit](https://github.com/kriasoft/react-starter-kit) — Isomorphic web app boilerplate (React, Node.js, Babel, Webpack, CSS Modules)
* [React Static Boilerplate](https://github.com/kriasoft/react-static-boilerplate) — Single-page application (SPA) starter kit (React, Redux, Webpack, Firebase)
* [Membership Database](https://github.com/membership/membership.db) — SQL schema boilerplate for user accounts, profiles, roles, and auth claims


## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE.txt](https://github.com/kriasoft/nodejs-api-starter/blob/master/LICENSE.txt) file.

---
Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@tarkus)) and [contributors](https://github.com/kriasoft/nodejs-api-starter/graphs/contributors)


[nodejskit]: https://github.com/kriasoft/nodejs-api-starter
[rsk]: https://github.com/kriasoft/react-starter-kit
[node]: https://nodejs.org
[js]: https://developer.mozilla.org/docs/Web/JavaScript
[babel]: http://babeljs.io/
[gql]: http://graphql.org/
[yarn]: https://yarnpkg.com
[demo]: https://graphql-demo.kriasoft.com/
[pg]: https://www.postgresql.org/
[psql]: https://www.postgresql.org/docs/current/static/app-psql.html
[do]: https://m.do.co/c/eef302dbae9f
[code]: https://code.visualstudio.com/
[wstorm]: https://www.jetbrains.com/webstorm/
[docker]: https://www.docker.com/community-edition
[compose]: https://docs.docker.com/compose/
[v8debug]: https://chromedevtools.github.io/debugger-protocol-viewer/v8/
[vsdebug]: https://code.visualstudio.com/Docs/editor/debugging
[passport]: http://passportjs.org/
[redis]: https://redis.io/
[loader]: https://github.com/facebook/dataloader
[gitter]: https://gitter.im/kriasoft/nodejs-api-starter
[skype]: https://calendly.com/koistya
