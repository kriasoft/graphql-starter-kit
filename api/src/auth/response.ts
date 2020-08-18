/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import fs from "fs";
import { compile } from "handlebars";

const file = `${__filename.substring(0, __filename.lastIndexOf("."))}.hbs`;
export default compile(fs.readFileSync(file, "utf8"));
