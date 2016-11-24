# GraphQL Starter Kit &nbsp; <a href="https://github.com/kriasoft/graphql-starter-kit/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/graphql-starter-kit.svg?style=social&label=Star&maxAge=3600" height="20"></a> <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>

Project template for authoring **[GraphQL](http://graphql.org/)** server
applications with **Node.js 6+** and **JavaScript** (**[demo](https://api.reactstarterkit.com)**).
You can use it either just as a playground or a base for your next API project.

---
<p align="center">
  <b>🔥 Want to strengthen your core JavaScript skills and master ES6?</b>
  <br>I would personally recommend this awesome
  <a href="https://es6.io/friend/konstantin">ES6 course</a> by Wes Bos.
</p>
---


### Directory Layout

```sh
.
├── /build/                     # The compiled output (via Babel)
├── /node_modules/              # Project dependencies (npm modules)
├── /src/                       # Node.js application source files
│   ├──/types/                  # GraphQL types /w resolve functions
│   │   ├── /User.js            # User account (id, email, etc.)
│   │   ├── /Viewer.js          # The top-level GraphQL object type
│   │   └── /...                # etc.
│   ├── /app.js                 # Node.js application (entry point)
│   ├── /config.js              # Node.js application settings
│   └── /schema.js              # GraphQL schema
├── /test/                      # Unit and integration tests
│── package.json                # The list of project dependencies
└── run.js                      # Build automation scripts
```


### Getting Started

Just clone the repo and start hacking:

```sh
$ git clone -o graphql-starter-kit -b master --single-branch \
      https://github.com/kriasoft/graphql-starter-kit.git api.example.com
$ cd api.example.com
$ npm install
$ npm start
```

The GraphQL server should become available at [http://localhost:5000/](http://localhost:5000/)
([live demo](https://api.reactstarterkit.com))


### How to Test

```sh
$ npm test
```


### Related Projects

* [GraphQL.js](https://github.com/graphql/graphql-js) — The JavaScript reference implementation for [GraphQL](http://graphql.org/)
* [React Starter Kit](https://github.com/kriasoft/react-starter-kit) — Isomorphic web app boilerplate (React, Node.js, Babel, Webpack, CSS Modules)
* [React Static Boilerplate](https://github.com/kriasoft/react-static-boilerplate) — Single-page application (SPA) starter kit (React, Redux, Webpack, Firebase)
* [Membership Database](https://github.com/membership/membership.db) — SQL schema boilerplate for user accounts, profiles, roles, and auth claims


### Support

* [#react-starter-kit](http://stackoverflow.com/questions/tagged/react-starter-kit) on Stack Overflow — Questions and answers
* [#react-starter-kit](https://gitter.im/kriasoft/react-starter-kit) on Gitter — Watch announcements, share ideas and feedback
* [GitHub Issues](https://github.com/kriasoft/graphql-starter-kit/issues) — Check open issues, send feature requests
* [@koistya](https://twitter.com/koistya) on [Codementor](https://www.codementor.io/koistya) or [HackHands](https://hackhands.com/koistya/) — Private consulting


### License

Copyright © 2016-present Kriasoft, LLC. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/kriasoft/graphql-starter-kit/blob/master/LICENSE.txt)
file. The documentation to the project is licensed under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) license.


---
Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya)) and [contributors](https://github.com/kriasoft/graphql-starter-kit/graphs/contributors)
