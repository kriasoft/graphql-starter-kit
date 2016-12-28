# Automation Scripts

The `*.js` scripts in this folder are intended to be used from inside the running `api` Docker
container. First, make sure that all the required Docker containers are running:

```bash
docker-compose up               # Launch Docker containers, press CTR+Z (transfer to background)
```

Then open a new terminal session from inside the `api` container by running:

```bash
docker-compose exec api /bin/sh
```

From this shell you must be able to execute `scripts/*.js` files directly or by using
[`yarn run`][yarnrun]. Alternatively, execute any command directly on a running container with:

```bash
docker-compose exec api <command>
```

New to Docker? Please, skim through the [Docker in Action](http://amzn.to/2hmUrNP) book that
describes all the main concepts.


### [`db.js`](./db.js) — database management

The following commands can be used to transfer your existing database into another state and vise
versa. Those state transitions are saved in migration files ([`migrations/*.js`](../migrations)),
which describe the way how to get to the new state and how to revert the changes in order to get
back to the old state.

```bash
node --harmony scripts/db version         # Print database schema version
node --harmony scripts/db migrate         # Migrate database schema to the latest version
node --harmony scripts/db migrate:undo    # Rollback the latest migration
node --harmony scripts/db migration       # Create a new migration from the template
node --harmony scripts/db seed            # Import reference data
```

For more information on how use migrations reffer to [Knex documentation][knex].


### [`build.js`](./build.js) — compilation

```bash
node scripts/build              # Compile the app into the ./build folder
```


### [`run.js`](./run.js) — launching for testing/debugging

```bash
node scripts/run                # Compile the app and launch Node.js server with "live reload"
```

This script will also execute `yarn install` in case some of the Node.js dependencies are missing.


### [`publish.sh`](./publish.sh) — deployment

```bash
/bin/sh scripts/publish.sh      # Compile the app, build a Docker image and deploy it
```


[yarnrun]: https://yarnpkg.com/en/docs/cli/run
[knex]: http://knexjs.org/
