# Node.js API Starter Kit &nbsp; <a href="https://gitter.im/kriasoft/nodejs-api-starter"><img src="https://img.shields.io/gitter/room/kriasoft/nodejs-api-starter.js.svg" width="102" height="20"></a> <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/nodejs-api-starter.svg?style=social&label=Star&maxAge=3600" height="20"></a> <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

[Node.js API Starter Kit][nodejskit] is a boilerplate and tooling for authoring **data API**
backends with [Node.js][node], [JavaScript][js] (via [Babel][babel]) and [GraphQL][gql]. It's
meant to be paired with a web and/or mobile application project such as [React Starter Kit][rsk].


## Features

✓ Cross-platform, develope on macOS, Windows or Linux inside a [Docker][docker] container<br>
✓ No development dependencies except for [Docker][docker] v1.12.5 or neweer<br>
✓ Authentication and authorization via [Passport.js][passport] (see [`src/passport`](./src/passport))<br>
✓ Session and cache management with [Redis][redis] (see [stop using JWT for sessions](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/))<br>
✓ [PostgreSQL][pg] database schema boilerplate and migration tools (see [`scripts`](./scripts), [`migrations`](./migrations))<br>
✓ [GraphQL][gql] boilerplate, everything needed to get started building a [GraphQL][gql] API endpoint<br>
✓ The exact same process is used to build the app for production and build for running/testing locally<br>


## Directory Layout

```bash
.
├── /build/                     # The compiled output (via Babel)
├── /migrations/                # Database schema migrations
├── /scripts/                   # Build automation scripts
├── /src/                       # Node.js application source files
│   ├── /db/                    # Database access and connection pooling
│   ├── /passport/              # Passport.js authentication strategies
│   ├── /routes/                # Express routes, e.g. /login/facebook
│   ├── /types/                 # GraphQL types with resolve functions
│   │   ├── /User.js            # User account (id, email, etc.)
│   │   ├── /Viewer.js          # The top-level GraphQL object type
│   │   └── /...                # etc.
│   ├── /app.js                 # Express.js application
│   ├── /schema.js              # GraphQL schema
│   └── /server.js              # Node.js server (entry point)
├── /test/                      # Unit, integration and load tests
├── .env                        # Application settings for the dev environment
├── .env.example                # Available application settings as a reference
├── docker-compose.yml          # Defines Docker services, networks and volumes
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # The list of project dependencies
└── yarn.lock                   # Fixed versions of all the dependencies
```


## Getting Started

Make sure that you have [Docker][docker] v1.12.5 or newer installed plus a good text editor or IDE
([VS Code][code], [WebStorm][wstorm] or another), clone the repo and launch the app with [Docker
Compose][compose]:

```bash
git clone -o nodejs-api-starter -b master --single-branch \
   https://github.com/kriasoft/nodejs-api-starter.git example-api
cd example-api
cp .env.example .env            # Copy environment variables from the template: '.env.example' -> '.env'
docker-compose up               # Launch Docker containers with the Node.js API app running inside
```

The API server must become available at [http://localhost:5000/](http://localhost:5000/)
([live demo][demo]).

Once the docker container named `api` is started, the Docker engine executes `node scripts/run.js`
command that installs Node.js dependencies, migrates database schema to the latest version,
compiles Node.js app from source files (see [`src`](./src)) and launches it with "live reload"
on port `5000` (see [`.env`](.env.example)).

In order to open a new terminal session from inside the `api` Docker container run:

```bash
docker-compose exec api /bin/sh
```

From this shell you can run automation scripts such as `yarn test`, `yarn run db:migrate` etc.
Find the full list of scripts available inside the [`scripts`](./scripts) folder and
the [`package.json`](./package.json) file.


## Testing

```bash
yarn run lint                   # Find problematic patterns in code
yarn run check                  # Check source code for type errors
yarn run test                   # Run unit tests once
yarn run test:watch             # Run unit tests in watch mode
```


## Debugging

In order to run the app with [V8 inspector][v8debug] enabled, simply set `NODE_DEBUG=true` flag in
the [`.env`](.env.example) file, restart the app (`docker-compose up`) and [attach your
debugger][vsdebug] to `127.0.0.1:9229` (see [`.vscode/launch.json`](https://gist.github.com/koistya/421ea3e0139225b27f909e98202a34de)
for [VS Code][code] as an example).


## Deployment

Customize the deployment script found in `scripts/publish.js` on macOS/Linux or convert it to
`publish.cmd` on Windows. Then whenever you need to deploy your app to a remote server simply run:

```bash
/bin/sh scripts/publish.sh      # or, `scripts/publish.cmd` on Windows
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
* [React Starter Kit](https://github.com/kriasoft/react-starter-kit) — Isomorphic web app boilerplate (React, Node.js, Babel, Webpack, CSS Modules)
* [React Static Boilerplate](https://github.com/kriasoft/react-static-boilerplate) — Single-page application (SPA) starter kit (React, Redux, Webpack, Firebase)
* [Membership Database](https://github.com/membership/membership.db) — SQL schema boilerplate for user accounts, profiles, roles, and auth claims


## Support

* [#nodejs-api-starter](http://stackoverflow.com/questions/tagged/nodejs-api-starter) on Stack Overflow — Questions and answers
* [#nodejs-api-starter](https://gitter.im/kriasoft/nodejs-api-starter) on Gitter — Watch announcements, share ideas and feedback
* [GitHub Issues](https://github.com/kriasoft/nodejs-api-starter/issues) — Check open issues, send feature requests
* [@koistya](https://twitter.com/koistya) on [Codementor](https://www.codementor.io/koistya) or [HackHands](https://hackhands.com/koistya/) — Private consulting


## License

Copyright © 2016-present Kriasoft, LLC. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/kriasoft/nodejs-api-starter/blob/master/LICENSE.txt)
file. The documentation to the project is licensed under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) license.


---
Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya), [blog](https://medium.com/@tarkus)) and [contributors](https://github.com/kriasoft/nodejs-api-starter/graphs/contributors)


[nodejskit]: https://github.com/kriasoft/nodejs-api-starter
[rsk]: https://github.com/kriasoft/react-starter-kit
[node]: https://nodejs.org
[js]: https://developer.mozilla.org/docs/Web/JavaScript
[babel]: http://babeljs.io/
[gql]: http://graphql.org/
[yarn]: https://yarnpkg.com
[demo]: https://reactstarter.com/graphql
[pg]: https://www.postgresql.org/
[do]: https://m.do.co/c/eef302dbae9f
[code]: https://code.visualstudio.com/
[wstorm]: https://www.jetbrains.com/webstorm/
[docker]: https://www.docker.com/products/docker
[compose]: https://docs.docker.com/compose/
[v8debug]: https://chromedevtools.github.io/debugger-protocol-viewer/v8/
[vsdebug]: https://code.visualstudio.com/Docs/editor/debugging
[passport]: http://passportjs.org/
[redis]: https://redis.io/

