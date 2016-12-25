# generator-nodejs-api [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

[Yeoman][yo] generator based on [Node.js API Starter Kit][nodeapi] — boilerplate and tooling for
authoring data API backends with Docker, Node.js, JavaScript (ES2017+ via Babel), PostgreSQL and
GraphQL.


## Installation

First, install [Yeoman][yo] and `generator-nodejs-api` using [npm](https://www.npmjs.com/) (we assume you have pre-installed [Node.js](https://nodejs.org/) 6+ and [Yarn](https://yarnpkg.com/)).

```bash
npm install -g yo
npm install -g generator-nodejs-api
```

Then generate your new project:

```bash
mkdir example-api
cd example-api
yo nodejs-api
```

Then you can launch your data API server by running `docker-compose up`.

For more information visit https://github.com/kriasoft/nodejs-api-starter


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

[nodeapi]: https://github.com/kriasoft/nodejs-api-starter
[yo]: https://yeoman.io
[npm-image]: https://badge.fury.io/js/generator-graphql-server.svg
[npm-url]: https://npmjs.org/package/generator-graphql-server
[travis-image]: https://travis-ci.org/kriasoft/generator-graphql-server.svg?branch=master
[travis-url]: https://travis-ci.org/kriasoft/generator-graphql-server
[daviddm-image]: https://david-dm.org/kriasoft/generator-graphql-server.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/kriasoft/generator-graphql-server
[coveralls-image]: https://coveralls.io/repos/kriasoft/generator-graphql-server/badge.svg
[coveralls-url]: https://coveralls.io/r/kriasoft/generator-graphql-server
