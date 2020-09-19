# Relay Client Configuration

[Relay](https://relay.dev/) client configurations for both (Node.js) server and
browser environments.

The main difference between these two is the network layer as you can see below:

##### [`package.json`](./package.json)

```json
{
  "main": "relay.server.ts",
  "browser": "relay.browser.ts"
}
```

##### [`relay.browser.ts`](./relay.browser.ts)

```ts
fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: {
    query: operation.text,
    variables,
  },
});
```

##### [`relay.server.ts`](./relay.server.ts)

```ts
import { graphql } from "graphql";
import { schema, Context } from "@example/api";
```

```ts
graphql({
  schema,
  source: operation.text,
  contextValue: new Context(req),
  variableValues: variables,
  operationName: operation.name,
});
```

Note that implementing server-side version of Relay client is not strictly
necessary. As longs as the app renders fast enough (using optimization
techniques other than full SSR) and meta tags are in place (`<title>...</title>`,
`<meta name="description" content="...">`, etc., a.k.a. partial SSR) it should
be good enough in most cases.

## References

- [Relay hooks, a step by step guide](https://relay.dev/docs/en/experimental/step-by-step)
