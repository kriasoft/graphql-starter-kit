/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { default as home } from "./home";
import { default as account } from "./account";
import { default as user } from "./user";

/**
 * The list of application routes (pages).
 */
export default [home, account, user] as const;
