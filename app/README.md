# Web Application

Web application project built with TypeScript, React, and Relay.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/), [Babel](https://babeljs.io/)
- [React](https://reactjs.org/), [Relay](https://relay.dev/), [Emotion](https://emotion.sh/)
- [Cloudflare Workers](https://workers.cloudflare.com/) for application
  routing/rendering at CDN edge locations

## Directory Structure

`├──`[`common`](./common) — Common (shared) React components<br>
`├──`[`core`](./core) — Core modules, React hooks, customized theme, etc.<br>
`├──`[`dialogs`](./dialogs) — React components implementing modal dialogs<br>
`├──`[`icons`](./icons) — custom SVG icons in addition to `@mui/icons-material`<br>
`├──`[`layout`](./layout) — Layout related components<br>
`├──`[`public`](./public) — static files such as `robots.txt`, `favicon.ico`, etc.<br>
`├──`[`queries`](./queries) — generated GraphQL query fragments<br>
`├──`[`routes`](./routes) — application routes / pages<br>
`├──`[`theme`](./theme) — customized Material UI theme<br>
`├──`[`global.d.ts`](./global.d.ts) — Global TypeScript declarations<br>
`├──`[`index.html`](./index.html) — HTML page containing application entry point<br>
`├──`[`index.tsx`](./index.tsx) — Single-page application (SPA) entry point<br>
`├──`[`package.json`](./package.json) — Workspace settings and NPM dependencies<br>
`├──`[`tsconfig.ts`](./tsconfig.json) — TypeScript configuration<br>
`└──`[`vite.config.ts`](./vite.config.ts) — JavaScript bundler configuration ([docs](https://vitejs.dev/config/))<br>

## Getting Started

```bash
$ yarn app:relay [--watch]      # Compile GraphQL fragments
$ yarn app:start                # Launch the app using Vite dev server
```

The app must become available on [`http://localhost:5173/`](http://localhost:5173/).

## How to Deploy

Ensure that all the environment variables found in [`../env`](../env/) folder
for the target deployment environment (`test`, `prod`) are up-to-date. Push the
required secrets to Cloudflare Workers environment, for example:

```
$ yarn edge:cf secret put GOOGLE_CLOUD_CREDENTIALS
```

Finally, build and deploy the app by running:

```
$ yarn app:build
$ yarn app:deploy [--env #0] [--version #0]
```

Where `--env` is the target deployment environment, e.g. `--env=test` (default).

Once the app was deployed, you can access Cloudflare Workers logs via:

```
$ yarn edge:cf tail [--env #0] [--version #0]
```

For the full list of Cloudflare CLI options run `yarn edge:cf --help`.

## References

- https://react.dev/ — React.js documentation
- https://mui.com/core/ — Material UI library documentation
- https://www.typescriptlang.org/ — TypeScript reference
- https://vitejs.dev/ — Front-end tooling (bundler)
- https://vitest.dev/ — Unit test framework
