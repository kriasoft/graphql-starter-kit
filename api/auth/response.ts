/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import fs from "fs";
import Handlebars, { compile } from "handlebars";

Handlebars.registerHelper("json", (context) => {
  return context
    ? JSON.stringify(context).replace(/<\/script/gi, "</\\u0073cript")
    : "null";
});

const file = `${__filename.substring(0, __filename.lastIndexOf("."))}.hbs`;
export default compile(fs.readFileSync(file, "utf8"));
