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
`├──`[`dialogs`](./dialogs) — modal dialog components<br>
`├──`[`icons`](./icons) — custom SVG icons in addition to `@mui/icons-material`<br>
`├──`[`menus`](./menus) — pop-up menu components<br>
`├──`[`public`](./public) — static files such as `robots.txt`, `favicon.ico`, etc.<br>
`├──`[`queries`](./queries) — generated GraphQL query fragments<br>
`├──`[`routes`](./routes) — application routes / pages<br>
`├──`[`theme`](./theme) — customized Material UI theme<br>
`├──`[`workers`](./workers) — reverse proxy deployed to Cloudflare Workers (CDN edges)<br>
`├──`[`config.ts`](./config.ts) — client-side configuration settings<br>
`├──`[`index.tsx`](./index.tsx) — application entry<br>
`└──`[`webpack.config.js`](./webpack.config.js) — Webpack configuration<br>

## Getting Started

```bash
$ yarn web:relay [--watch]      # Compile GraphQL fragments
$ yarn web:start                # Launch the app using Webpack Dev Server
```

The app must become available on [`http://localhost:3000/`](http://localhost:3000/).

## How to Deploy

Ensure that all the environment variables found in [`../env`](../env/) folder
for the target deployment environment (`test`, `prod`) are up-to-date. Push the
required secrets to Cloudflare Workers environment, for example:

```
$ yarn web:cf secret put GOOGLE_CLOUD_CREDENTIALS
```

Finally, build and deploy the app by running:

```
$ yarn web:build
$ yarn web:deploy [--env #0] [--version #0]
```

Where `--env` is the target deployment environment, e.g. `--env=test` (default).

Once the app was deployed, you can access Cloudflare Workers logs via:

```
$ yarn web:cf tail [--env #0] [--version #0]
```

For the full list of Cloudflare CLI options run `yarn web:cf --help`.
