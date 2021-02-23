# Web Application

Web application project built with TypeScript, React, and Relay.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/)
- [React](https://reactjs.org/), [Relay](https://relay.dev/), [Emotion](https://emotion.sh/)
- [Cloudflare Workers](https://workers.cloudflare.com/) for application
  routing/rendering at CDN edge locations

## Directory Structure

`├──`[`common`](./common) — common React components, UI building blocks<br>
`├──`[`core`](./core) — core application modules (Relay store, router, etc.)<br>
`├──`[`hooks`](./hooks) — common React hooks such as `useAuth()`, `useHistory()`, etc.<br>
`├──`[`proxy`](./proxy) — reverse proxy deployed to Cloudflare Workers (CDN edges)<br>
`├──`[`public`](./public) — static files such as `robots.txt`, `favicon.ico`, etc.<br>
`├──`[`routes`](./routes) — application routes / pages<br>
`├──`[`main.ts`](./main.ts) — application entry<br>
`└──`[`webpack.config.js`](./webpack.config.js) — Webpack configuration<br>

## Getting Started

```bash
$ yarn web:relay                # Compile GraphQL fragments
$ yarn web:start                # Launch the app using Webpack Dev Server
```

The app must become available on [`http://localhost:3000/`](http://localhost:3000/).

## How to Deploy

Compile and bundle the code into the `dist/web` folder (`yarn build`),
optionally upload it to Google Cloud Storage (`yarn push`), and finally,
deploy or re-deploy by running `yarn deploy`.

```
$ yarn web:build
$ yarn web:push [--version #0]
$ yarn web:deploy [--version #0] [--env #0]
```

**NOTE**: These three separate steps are necessary in order to optimize the CI/CD
workflows (see `.github/workflows`).

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/graphql-starter/blob/main/LICENSE) file.
