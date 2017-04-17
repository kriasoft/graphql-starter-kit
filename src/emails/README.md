# Email Templates

This folder contains HTML templates for transactional email, each template in its own folder.
For example:

```bash
.
├── /welcome/                   # The email template for sending a welcome message
│   ├── /html.hbs               # The HTML version of the message
│   └── /subject.hbs            # The subject of the email
└── layout.hbs                  # Layout markup (header, footer etc.)
```

For testing purposes, there is `/emails/:template` endpoint (see [`src/app.js`][app]) that you can
use for testing these templates in a browser. For example, in order to see how the `welcome`
template renders in a browser simply navigate to:

https://localhost:8080/emails/welcome

All the templates in this folder are pre-compiled at build time (see [`tools/build.js`][build])
and consumed by the `email` component (see [`src/email.js`][email]).

#### Usage example:

```js
import email from './email';

app.get('/test', async (req, res) => {
  const message = email.render('welcome', { t: req.t });
  await email.send(message, { to: 'hello@example.com' });
  res.send('Sent');
});
```

#### For more information please visit:

* [Nodemailer][nmailer] a Node.js module for sending email messages
* [Juice][juice] library for inlining CSS stylesheets into HTML sources
* [Handlebars][hbs] template engine that is well suited for writing email templates
* [Handlebars Layouts][hbsl] a plugin for Handlebars that adds layout support
* [Responsive HTML Email template][tpl] by by Lee Munroe

[nmailer]: https://nodemailer.com/about/
[juice]: https://github.com/Automattic/juice
[hbs]: http://handlebarsjs.com/
[hbsl]: https://github.com/shannonmoeller/handlebars-layouts
[tpl]: https://github.com/leemunroe/responsive-html-email-template
[build]: ../../tools/build.js
[app]: ../app.js
[email]: ../email.js
