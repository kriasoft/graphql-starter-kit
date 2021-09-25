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

```
$ yarn web:build
$ yarn web:deploy [--version #0] [--env #0]
```
