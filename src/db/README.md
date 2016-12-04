# Database Access

#### Usage example:

```js
import db from './db';
```

```js
let user = await db.users.findById(123); // => { id: 123, email: 'hello@example.com' }
```

For more information visit [`pg`](https://github.com/brianc/node-postgres)
([docs](https://github.com/brianc/node-postgres/wiki)) and
[`pg-pool`](https://github.com/brianc/node-pg-pool) projects.
