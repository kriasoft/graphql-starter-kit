# Web Application

Web application project built with TypeScript, React, and Relay.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/), [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/), [Relay](https://relay.dev/), [Emotion](https://emotion.sh/)

## Getting Started

```bash
$ yarn web:relay                # Compile GraphQL fragments
$ yarn web:start                # Launch Next.js web app
```

The app must become available on [`http://localhost:3000/`](http://localhost:3000/).

## How to Deploy

Compile and bundle the code into the `dist/web.zip` file (`yarn build`), upload
it to Google Cloud Storage (`yarn push`), and finally, deploy or re-deploy
the Google Cloud Function straight from GCS (`yarn deploy`).

```
$ yarn web:build
$ yarn web:push [--version=#0]
$ yarn web:deploy [--version=#0] [--env=#1]
```

**NOTE**: These three separate steps are necessary in order to optimize the CI/CD
workflows (see `.github/workflows`).

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/nodejs-api-starter/blob/main/LICENSE) file.
