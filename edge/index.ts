/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "./core/app.js";
// Register `/__/*` middleware (Firebase Auth)
import "./routes/firebase.js";
// Register `/api/*` route handler (GraphQL API)
import "./routes/api.js";
// Register `/echo` route handler (debugging)
import "./routes/echo.js";
// Register `*` static assets handler (HTML, CSS, JS, etc.)
import "./routes/assets.js";

export default app;
