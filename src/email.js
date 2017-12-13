/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

// TODO: Configure email transport for the production environment
// https://nodemailer.com/smtp/
const { from, ...config } =
  process.env.NODE_ENV === 'production'
    ? {
        from: 'no-reply@example.com',
        streamTransport: true,
      }
    : {
        from: 'no-reply@example.com',
        streamTransport: true,
      };

const templates = new Map();
const baseDir = path.resolve(__dirname, 'emails');
const transporter = nodemailer.createTransport(config, { from });

// Register i18n translation helper, for example: {{t "Welcome, {{user}}" user="John"}}
handlebars.registerHelper('t', (key, options) =>
  options.data.root.t(key, options.hash),
);

function loadTemplate(filename) {
  const m = new module.constructor();
  // eslint-disable-next-line no-underscore-dangle
  m._compile(fs.readFileSync(filename, 'utf8'), filename);
  return handlebars.template(m.exports);
}

/**
 * Usage example:
 *
 *   const message = await email.render('welcome', { name: 'John' });
 *   await email.send({
 *     to: '...',
 *     from: '...',
 *     ...message,
 *   });
 */
export default {
  /**
   * Renders email message from a template and context variables.
   * @param {string} name The name of a template to render. See `src/emails`.
   * @param {object} context Context variables.
   */
  render(name: string, context: any = {}) {
    if (!templates.size) {
      fs.readdirSync(baseDir).forEach(template => {
        if (fs.statSync(`${baseDir}/${template}`).isDirectory()) {
          templates.set(template, {
            subject: loadTemplate(`${baseDir}/${template}/subject.js`),
            html: loadTemplate(`${baseDir}/${template}/html.js`),
          });
        }
      });
    }

    const template = templates.get(name);

    if (!template) {
      throw new Error(`The email template '${name}' is missing.`);
    }

    return {
      subject: template.subject(context),
      html: template.html(context),
    };
  },
  /**
   * Sends email message via Nodemailer.
   */
  send(message: any, options: any) {
    return transporter.sendMail({
      ...message,
      ...options,
    });
  },
};
