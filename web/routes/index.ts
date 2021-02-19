/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { default as home } from "./home";
import { default as settings } from "./settings";

/**
 * The list of application routes (pages).
 */
export default [home, settings] as const;
