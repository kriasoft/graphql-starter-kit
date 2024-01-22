/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createYoga } from "graphql-yoga";
import uWS from "uWebSockets.js";
import { db, env } from "./core";
import { getIdToken } from "./core/auth";
import { schema } from "./schema";

/**
 * GraphQL API server middleware.
 * @see https://the-guild.dev/graphql/yoga-server/docs
 */
const yoga = createYoga({
  schema,
  async context({ request }) {
    const token = await getIdToken(request);
    return { token };
  },
});

/**
 * High performance HTTP and WebSocket server based on uWebSockets.js.
 * @see https://github.com/uNetworking/uWebSockets
 */
const app = uWS
  .App()
  // GraphQL API endpoint.
  .any("/*", yoga);

/**
 * Starts the HTTP server.
 */
export function listen() {
  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}/`);
  });

  return async () => {
    app.close();
    await db.destroy();
  };
}

// Start the server if running in a Cloud Run environment.
if (env.K_SERVICE) {
  const close = listen();
  process.on("SIGINT", () => close());
  process.on("SIGTERM", () => close());
}
