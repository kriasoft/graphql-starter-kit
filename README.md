# Node.js API Starter Kit &nbsp; <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/nodejs-api-starter.svg?style=social&label=Star&maxAge=3600" height="20"></a> <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

[Node.js API Starter Kit][nodejskit] is a boilerplate and tooling for authoring
**data API** backends with [Node.js][node] 7+, [JavaScript][js] (via
[Babel][babel]) and [GraphQL][gql]. It's meant to be paired with a web and/or
mobile application project such as [React Starter Kit][rsk].


## Prerequisites

* macOS, Windows or Linux
* [Docker][docker] v1.12.5 or newer
* Text editor or IDE (e.g. [VS Code][code], [WebStorm][wstorm] etc.)


## Directory Layout

```bash
.
├── /build/                     # The compiled output (via Babel)
├── /migrations/                # Database schema migrations
├── /node_modules/              # Project dependencies (npm modules)
├── /scripts/                   # Build automation scripts
├── /src/                       # Node.js application source files
│   ├── /db/                    # Database access methods and connection pooling
│   ├── /passport/              # Passport.js authentication strategies
│   ├── /routes/                # Express routes, e.g. /login/facebook
│   ├── /types/                 # GraphQL types /w resolve functions
│   │   ├── /User.js            # User account (id, email, etc.)
│   │   ├── /Viewer.js          # The top-level GraphQL object type
│   │   └── /...                # etc.
│   ├── /app.js                 # Express application
│   ├── /schema.js              # GraphQL schema
│   └── /server.js              # Node.js server (entry point)
├── /test/                      # Unit, integration and load tests
├── .env                        # Application settings for the dev environment
├── .env.example                # Available application settings for a reference
├── docker-compose.yml          # Defines Docker services, networks and volumes
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # The list of project dependencies
└── yarn.lock                   # Fixed versions of all the dependencies
```


## Getting Started

Just clone the repo and launch the app with [Docker Compose][compose]:

```bash
git clone -o nodejs-api-starter -b master --single-branch \
   https://github.com/kriasoft/nodejs-api-starter.git example-api
cd example-api
cp .env.example .env            # Copy environment variables from the template: '.env.example' -> '.env'
docker-compose up               # Launch Docker containers with the Node.js API app running inside
```

The API server must become available at [http://localhost:5000/](http://localhost:5000/)
([live demo][demo]).

In order to open a new terminal session from inside the Docker container run:

```bash
$ docker-compose exec api /bin/sh
```


## Database

The following scripts can be used to transfer your existing database into another state and vise
versa. Those state transitions are saved in migration files (`/migrations/*.js`), which describe
the way how to get to the new state and how to revert the changes in order to get back to the old
state. You can execute them inside the `api` docker container.

```bash
yarn run db:version             # Print database schema version
yarn run db:migrate             # Migrate database schema to the latest version
yarn run db:migrate:undo        # Rollback the latest migration
yarn run db:migration <name>    # Create a new migration from the template (see /migrations folder)
yarn run db:seed                # Import reference data
```


## Testing

```bash
yarn run lint                   # Find problematic patterns in code
yarn run check                  # Check source code for type errors
yarn run test                   # Run unit tests once
yarn run test:watch             # Run unit tests in watch mode
```


## Debugging

```bash
# Option 1:
yarn run build && node build/server.js --debug --nolazy

# Option 2:
yarn run start -- --debug --nolazy
```

After launching the app in a debug mode [attach your debugger](https://code.visualstudio.com/Docs/editor/debugging)
to the process listening on `127.0.0.1:5858`.


## Deployment

Customize the deployment script found in `scripts/deploy.js` so you could run:

```bash
yarn run deploy                 # Build and push the app to the default deployment slot, or...
yarn run deploy --prod          # Build and push the app to the production deployment slot
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

* [#react-starter-kit](http://stackoverflow.com/questions/tagged/react-starter-kit) on Stack Overflow — Questions and answers
* [#react-starter-kit](https://gitter.im/kriasoft/react-starter-kit) on Gitter — Watch announcements, share ideas and feedback
* [GitHub Issues](https://github.com/kriasoft/nodejs-api-starter/issues) — Check open issues, send feature requests
* [@koistya](https://twitter.com/koistya) on [Codementor](https://www.codementor.io/koistya) or [HackHands](https://hackhands.com/koistya/) — Private consulting


## License

Copyright © 2016-present Kriasoft, LLC. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/kriasoft/nodejs-api-starter/blob/master/LICENSE.txt)
file. The documentation to the project is licensed under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) license.


---
Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya)) and [contributors](https://github.com/kriasoft/nodejs-api-starter/graphs/contributors)


[nodejskit]: https://github.com/kriasoft/nodejs-api-starter
[rsk]: https://github.com/kriasoft/react-starter-kit
[node]: https://nodejs.org
[js]: https://developer.mozilla.org/docs/Web/JavaScript
[babel]: http://babeljs.io/
[gql]: http://graphql.org/
[yarn]: https://yarnpkg.com
[demo]: https://www.reactstarterkit.com/graphql
[pg]: https://www.postgresql.org/
[do]: https://m.do.co/c/eef302dbae9f
[code]: https://code.visualstudio.com/
[wstorm]: https://www.jetbrains.com/webstorm/
[docker]: https://www.docker.com/products/docker
[compose]: https://docs.docker.com/compose/

