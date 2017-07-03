# Build Automation Tools

### [`db.js`](./db.js) — database management

The following commands can be used to transfer your existing database into another state and vise
versa. Those state transitions are saved in migration files ([`migrations/*.js`](../migrations)),
which describe the way how to get to the new state and how to revert the changes in order to get
back to the old state.

```bash
$ node tools/db version         # Print database schema version (see "migrations" db table)
$ node tools/db migrate         # Migrate database schema to the latest version
$ node tools/db rollback        # Rollback the latest migration
$ node tools/db migration       # Create a new migration file from the template
$ node tools/db seed            # Seed the database with some test data (see /seeds folder)
```

For more information on how to use migrations reffer to [Knex documentation][knex].

This script is intended to be executed from inside a running Docker container, for example:

```bash
$ docker-compose up             # Launch Docker containers, press CTR+Z (transfer to background)
$ docker-compose exec api node tools/db migrate    # Alternatively, "yarn docker-db-migrate"
```

New to Docker? Please, skim through the [Docker in Action](http://amzn.to/2hmUrNP) book that
describes all the main concepts.


### [`build.js`](./build.js) — compilation

```bash
$ node tools/build              # Compile the app into the ./build folder
```


### [`run.js`](./run.js) — launching for testing/debugging

```bash
$ node tools/run                # Compile the app and launch Node.js server with "live reload"
```

This script will also execute `yarn install` in case some of the Node.js dependencies are missing.


### [`publish.js`](./publish.js) — deployment

```bash
$ node tools/publish <host>     # Compile the app, build a Docker image and deploy it
```

..where `<host>` is the host name of the web server from your SSH configuration file
(`~/.ssh/config`).


[yarnrun]: https://yarnpkg.com/en/docs/cli/run
[knex]: http://knexjs.org/
