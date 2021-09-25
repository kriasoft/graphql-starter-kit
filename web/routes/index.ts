/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import account from "./account";
import home from "./home";
import legal from "./legal";
import user from "./user";

/**
 * The list of application routes (pages).
 */
export default [home, account, ...legal, user] as const;
