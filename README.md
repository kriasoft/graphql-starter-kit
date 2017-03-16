# generator-nodejs-api [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

[Yeoman][yo] generator based on [Node.js API Starter Kit][nodeapi] — boilerplate and tooling for
authoring data API backends with Docker, Node.js, JavaScript (ES2017+ via Babel), PostgreSQL and
GraphQL.

#### This project is maintained with support from <a href="https://rollbar.com/?utm_source=reactstartkit(github)&utm_medium=link&utm_campaign=reactstartkit(github)"><img src="https://koistya.github.io/files/rollbar-247x48.png" height="24" align="top" /></a> <a href="https://localizejs.com/?cid=802&utm_source=rsk"><img src="https://koistya.github.io/files/localize-221x48.png" height="24" align="top" /></a>

## Installation

First, install [Yeoman][yo] and `generator-nodejs-api` using [npm](https://www.npmjs.com/) (we assume you have pre-installed [Node.js](https://nodejs.org/) 7+).

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

And finally, launch your data API server by running `docker-compose up`.

For more information visit https://github.com/kriasoft/nodejs-api-starter

## Contributing

Anyone and everyone is welcome to [contribute](https://github.com/kriasoft/nodejs-api-starter/blob/master/CONTRIBUTING.md). Start by checking out the list of
[open issues](https://github.com/kriasoft/nodejs-api-starter/issues) marked
[help wanted](https://github.com/kriasoft/nodejs-api-starter/issues?q=label:"help+wanted").
However, if you decide to get involved, please take a moment to review the [guidelines](https://github.com/kriasoft/nodejs-api-starter/blob/master/CONTRIBUTING.md).


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


## Support

* [#nodejs-api-starter](http://stackoverflow.com/questions/tagged/nodejs-api-starter) on Stack Overflow — Questions and answers
* [#nodejs-api-starter](https://gitter.im/kriasoft/nodejs-api-starter) on Gitter — Watch announcements, share ideas and feedback
* [GitHub Issues](https://github.com/kriasoft/nodejs-api-starter/issues) — Check open issues, send feature requests
* [@koistya](https://twitter.com/koistya) on [Codementor](https://www.codementor.io/koistya), [HackHands](https://hackhands.com/koistya/) or [Skype][skype] — Private consulting and customization requests


## License

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
