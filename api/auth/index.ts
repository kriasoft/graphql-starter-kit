/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { Router } from "express";
import facebook from "./facebook";
import google from "./google";

const auth = Router();

auth.use(google);
auth.use(facebook);

export { auth };
