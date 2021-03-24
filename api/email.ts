/**
 * Email renderer and sender for transactional emails.
 *
 * @see https://github.com/forwardemail/email-templates
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import Email from "email-templates";
import env from "./env";

export default new Email({
  message: {
    from: env.EMAIL_FROM,
  },
  views: {
    options: {
      extension: "hbs",
    },
    locals: {
      appName: env.APP_NAME,
    },
  },
});
