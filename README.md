# GraphQL Starter Kit &nbsp; <a href="https://github.com/kriasoft/graphql-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/graphql-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a> <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

Project template (aka boilerplate) for authoring web application **data API**s (backends) with
**[Node.js][node]** 7+, **[JavaScript][js]** (via [Babel][babel]) and **[GraphQL][gql]**
([live demo][demo]). You can use it either as a playground or a base framework for your next
**Node.js-based data API** project.


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
├── package.json                # The list of project dependencies
└── yarn.lock                   # Fixed versions of all the dependencies
```


## Prerequisites

* OS X, Windows or Linux
* [Node.js][node] v7 or newer + [Yarn][yarn] package manager
* [PostgreSQL][pg] v9.5 or newer (see [how to install PostgreSQL on a dev machine](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup))
* Text editor or IDE (e.g. [VS Code][code], [WebStorm][wstorm] etc.)


## Getting Started

Just clone the repo and start hacking:

```bash
git clone -o graphql-starter-kit -b master --single-branch \
   https://github.com/kriasoft/graphql-starter-kit.git example.api
cd example.api
yarn install                    # Install project dependencies. Alternatively, npm install
yarn run db:create              # Create a new database (see .env/DATABASE_URL), or create it manually
yarn run db:migrate             # Migrate database schema to the latest version
yarn start                      # Launch the app. Alternatively, node scripts/start.js
```

The GraphQL server should become available at [http://localhost:5000/](http://localhost:5000/)
([live demo][demo]).

If you just need to build the project without launching a dev server, run one of these two commands:

```bash
yarn run build                  # Compiles the app into the /build folder
yarn run build:watch            # Compiles the app and starts watching for changes
```


## Database

The following scripts can be used to transfer your existing database into another state and vise
versa. Those state transitions are saved in migration files (`/migrations/*.js`), which describe
the way how to get to the new state and how to revert the changes in order to get back to the old
state.

```bash
yarn run db:create              # Create a new database
yarn run db:drop                # Drop the database
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
[open issues](https://github.com/kriasoft/graphql-starter-kit/issues) marked
[help wanted](https://github.com/kriasoft/graphql-starter-kit/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the [guidelines](CONTRIBUTING.md):

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)


## Related Projects

* [GraphQL.js](https://github.com/graphql/graphql-js) — The JavaScript reference implementation for [GraphQL](http://graphql.org/)
* [React Starter Kit](https://github.com/kriasoft/react-starter-kit) — Isomorphic web app boilerplate (React, Node.js, Babel, Webpack, CSS Modules)
* [React Static Boilerplate](https://github.com/kriasoft/react-static-boilerplate) — Single-page application (SPA) starter kit (React, Redux, Webpack, Firebase)
* [Membership Database](https://github.com/membership/membership.db) — SQL schema boilerplate for user accounts, profiles, roles, and auth claims


## Support

* [#react-starter-kit](http://stackoverflow.com/questions/tagged/react-starter-kit) on Stack Overflow — Questions and answers
* [#react-starter-kit](https://gitter.im/kriasoft/react-starter-kit) on Gitter — Watch announcements, share ideas and feedback
* [GitHub Issues](https://github.com/kriasoft/graphql-starter-kit/issues) — Check open issues, send feature requests
* [@koistya](https://twitter.com/koistya) on [Codementor](https://www.codementor.io/koistya) or [HackHands](https://hackhands.com/koistya/) — Private consulting


## License

Copyright © 2016-present Kriasoft, LLC. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/kriasoft/graphql-starter-kit/blob/master/LICENSE.txt)
file. The documentation to the project is licensed under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) license.


---
Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya)) and [contributors](https://github.com/kriasoft/graphql-starter-kit/graphs/contributors)

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
