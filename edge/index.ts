/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "./core/app";
// Register `/__/*` middleware (Firebase Auth)
import "./routes/firebase";
// Register `/api/*` route handler (GraphQL API)
import "./routes/api";
// Register `/echo` route handler (debugging)
import "./routes/echo";
// Register `*` static assets handler (HTML, CSS, JS, etc.)
import "./routes/assets";

export default app;
