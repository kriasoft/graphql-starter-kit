/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import minimist from "minimist";
import config from "../api/core/dbConfig";

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: minimist(process.argv.slice(2)).env });

export default config;
