/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import account from "./account";
import home from "./home";
import legal from "./legal";
import user from "./user";

/**
 * The list of application routes (pages).
 */
export default [home, account, ...legal, user] as const;
