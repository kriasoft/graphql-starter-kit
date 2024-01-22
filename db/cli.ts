/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

// Database management CLI for PostgreSQL. Usage example:
//
//   $ yarn db create           # creates a new database
//   $ yarn db migrate --seed   # runs all migrations and seeds
//   $ yarn db types            # generates TypeScript types

import { Connector, IpAddressTypes } from "@google-cloud/cloud-sql-connector";
import chalk from "chalk";
import { program } from "commander";
import { configDotenv } from "dotenv";
import { execa } from "execa";
import kanel from "kanel";
import kanelZod from "kanel-zod";
import knex from "knex";
import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { EOL } from "node:os";
import { relative, resolve } from "node:path";
import { createInterface } from "node:readline";
import repl from "node:repl";
import { fileURLToPath } from "node:url";
import { oraPromise } from "ora";

const backupsDir = resolve(fileURLToPath(import.meta.url), "../backups");
const modelsDir = resolve(fileURLToPath(import.meta.url), "../models");
const migrationsDir = resolve(fileURLToPath(import.meta.url), "../migrations");
const seedsDir = resolve(fileURLToPath(import.meta.url), "../seeds");
const g = chalk.greenBright;
const d = chalk.gray;

/**
 * The main CLI entry point.
 * @see https://github.com/tj/commander.js#readme
 */
program
  .name("db")
  .description("Database management CLI for PostgreSQL")
  .option("-i, --interactive", "launch interactive terminal with Knex.js")
  .option("--env <env>", "target environment (e.g. prod, staging, test)")
  .option("-v, --version", "current database and migration versions")
  .option("--schema <schema>", "database schema", "public")
  .action(async function (_, cmd) {
    if (cmd.opts().interactive) {
      await createDatabase(cmd.opts());
      await interactive(cmd.opts());
    } else if (cmd.opts().version) {
      await version(cmd.opts());
    } else {
      program.help();
    }
  });

program
  .command("create")
  .description("create a new database if doesn't exist")
  .option("--env <env>", "target environment")
  .option("--schema <schema>", "database schema", "public")
  .action(async function (_, cmd) {
    await oraPromise(() => createDatabase(cmd.opts()), {
      text: cmd.description(),
      failText: (err) => err.message,
    });
  });

program
  .command("migrate")
  .description("run all migrations that have not yet been run")
  .option("--env <env>", "target environment")
  .option("--seed", "seed database with data after migration", false)
  .action(async function (_, cmd) {
    await oraPromise(
      async () => {
        const db = getDatabase(cmd.opts());
        db.migrate.latest().finally(() => db.destroy());
      },
      {
        text: cmd.description(),
        failText: (err) => err.message,
      },
    );
    if (cmd.opts().seed) {
      await oraPromise(
        async () => {
          const db = getDatabase(cmd.opts());
          db.seed.run().finally(() => db.destroy());
        },
        {
          text: "seed database with data",
          failText: (err) => err.message,
        },
      );
    }
  });

program
  .command("rollback")
  .description("rollback the last batch of migrations performed")
  .option("--env <env>", "target environment")
  .option("--all", "roll back all migrations", false)
  .action(async function (_, cmd) {
    await oraPromise(
      async () => {
        const db = getDatabase(cmd.opts());
        await db.migrate
          .rollback({}, cmd.opts().all)
          .finally(() => db.destroy());
      },
      {
        text: cmd.description(),
        failText: (err) => err.message,
      },
    );
  });

program
  .command("backup")
  .description("create a backup of the database data")
  .option("--env <env>", "target environment")
  .option("--schema <schema>", "database schema", "public")
  .action(async function (_, cmd) {
    await backup({ ...cmd.opts(), args: cmd.args });
  });

program
  .command("restore")
  .description("restore database data from a backup file")
  .option("--env <env>", "target environment")
  .option("--from-env <env>", "source environment")
  .option("--schema <schema>", "database schema", "public")
  .action(async function (_, cmd) {
    await restore({ ...cmd.opts(), args: cmd.args });
  });

program
  .command("types")
  .description("generate TypeScript types from a live db")
  .option("--env <env>", "target environment")
  .option("--schema <schema>", "database schema", "public")
  .action(async function (_, cmd) {
    await types(cmd.opts());
  });

program
  .command("psql")
  .description("launch PostgreSQL interactive terminal")
  .option("--env <env>", "target environment")
  .option("--schema <schema>", "database schema", "public")
  .allowUnknownOption(true)
  .action(async function (_, cmd) {
    await createDatabase(cmd.opts());
    await execa("psql", cmd.args, { stdio: "inherit" });
  });

program.parse();

/**
 * Loads environment variables from .env files.
 */
function loadEnv(envName?: string) {
  const root = resolve(fileURLToPath(import.meta.url), "../..");

  if (envName) {
    configDotenv({ path: resolve(root, `.env.${envName}.local`) });
    configDotenv({ path: resolve(root, `.env.${envName}`) });
  }

  configDotenv({ path: resolve(root, `.env.local`) });
  configDotenv({ path: resolve(root, `.env`) });
}

/**
 * Creates a new Knex.js database connection.
 */
function getDatabase(options?: { env?: string; schema?: string }) {
  loadEnv(options?.env);
  let connector: Connector | undefined = undefined;
  const db = knex({
    client: "pg",
    async connection() {
      if (/^\S+:\S+:\S+$/.test(process.env.PGHOST ?? "")) {
        connector = new Connector();
        const options = await connector.getOptions({
          instanceConnectionName: process.env.PGHOST!,
          ipType: IpAddressTypes.PUBLIC,
        });
        return {
          ...options,
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
        };
      }
      return {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT!),
        database: process.env.PGDATABASE,
      };
    },
    migrations: {
      directory: relative(process.cwd(), migrationsDir),
      tableName: "migration",
      schemaName: options?.schema,
      extension: "ts",
    },
    seeds: {
      directory: relative(process.cwd(), seedsDir),
      extension: "ts",
    },
  });

  const destroy = db.destroy;
  Object.defineProperty(db, "destroy", {
    value: async () => {
      await destroy.call(db);
      connector?.close();
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  return db;
}

async function version(options?: { env?: string; schema?: string }) {
  const db = getDatabase(options);

  try {
    await oraPromise(() => db!.select(db!.raw("version()")).then((x) => x[0]), {
      text: `Database: ${d("fetching...")}`,
      successText: (x) => `Database: ${g(x.version)}`,
      failText: (err) => err.message,
    });

    await oraPromise(() => db!.migrate.currentVersion(), {
      text: `Migration: ${d("fetching...")}`,
      successText: (result) => `Migration: ${g(result)}`,
      failText: (err) => err.message,
    });
  } finally {
    await db.destroy();
  }
}

/**
 * Creates a new database if it does not exist.
 */
async function createDatabase(options: { env?: string; schema?: string } = {}) {
  let db = getDatabase(options);
  const dbName = process.env.PGDATABASE;
  const pgUser = process.env.PGUSER;

  if (!dbName) throw new Error("PGDATABASE is not set");
  if (!pgUser) throw new Error("PGUSER is not set");

  try {
    await db.select(db.raw("current_database()"));
  } catch (err) {
    // Error code 3D000 indicates that the database does not exist.
    if ((err as NodeJS.ErrnoException).code !== "3D000") {
      throw err;
    }

    await db.destroy();

    process.env.PGDATABASE = "template1";

    db = getDatabase(options);

    // Attempt to create a new database.
    await db.raw(`CREATE DATABASE ?? WITH OWNER ??`, [dbName, pgUser]);

    // Attempt to create a new database schema.
    await db.raw(`CREATE SCHEMA IF NOT EXISTS ?? AUTHORIZATION ??`, [
      options?.schema,
      pgUser,
    ]);
  } finally {
    process.env.PGDATABASE = dbName;
    await db.destroy();
  }
}

/**
 * Launches an interactive terminal with Knex.js.
 */
async function interactive(options?: {
  env?: string;
  schema?: string;
  args?: string[];
}) {
  const db = getDatabase(options);
  Object.defineProperty(globalThis, "db", { value: db });

  // Fetch the current database version
  const [x] = await db.select(
    db.raw("version(), current_database() as database"),
  );

  console.log(`Connected to ${chalk.greenBright(x.database)}. Usage example:`);
  console.log(``);
  console.log(`   await db.table("user").first()`);
  console.log(`   await db.select(db.raw("version()"))`);
  console.log(`   await db.fn.newUserId()`);
  console.log(``);
  console.log(`Type ${chalk.greenBright(".exit")} to exit the REPL shell`);
  repl.start(chalk.blueBright(`#> `)).on("exit", () => db?.destroy());
}

/**
 * Exports database data to a backup file.
 */
async function backup(options?: {
  env?: string;
  schema?: string;
  args?: string[];
}) {
  const schema = options?.schema ?? "public";
  const db = getDatabase(options);

  const tables = await db
    .from("information_schema.tables")
    .where({
      table_schema: options?.schema ?? "public",
      table_type: "BASE TABLE",
    })
    .andWhereNot({ table_name: "migration" })
    .andWhereNot({ table_name: "migration_lock" })
    .select("table_name")
    .then((rows) => rows.map((row) => `"${row.table_name}"`).join(", "))
    .finally(() => db.destroy());

  const cmd = execa(
    "pg_dump",
    [
      "--verbose",
      "--data-only",
      `--schema=${schema}`,
      "--no-owner",
      "--no-privileges",
      // '--column-inserts',
      "--disable-triggers",
      "--exclude-table=migration",
      "--exclude-table=migration_lock",
      "--exclude-table=migration_id_seq",
      "--exclude-table=migration_lock_index_seq",
      ...(options?.args ?? []),
    ],
    { stdio: ["pipe", "pipe", "inherit"] },
  ).on("exit", (code) => {
    if (code && code !== 0) process.exit(code);
  });

  const timestamp = new Date().toISOString().replace(/(-|:|\.\d{3})/g, "");
  const suffix = options?.env ? `_${options.env}` : "";
  const file = resolve(backupsDir, `${timestamp}${suffix}.sql`);
  const out = createWriteStream(file, { encoding: "utf8" });
  const rl = createInterface({ input: cmd.stdout!, terminal: false });

  rl.on("line", (line) => {
    // Some (system) triggers cannot be disabled in a cloud environment
    // "DISABLE TRIGGER ALL" => "DISABLE TRIGGER USER"
    if (line.endsWith(" TRIGGER ALL;")) {
      out.write(`${line.substring(0, line.length - 5)} USER;${EOL}`, "utf8");
    }
    // Add a command that truncates all the database tables
    else if (line.startsWith("SET row_security")) {
      out.write(`${line}${EOL}${EOL}TRUNCATE TABLE ${tables} CASCADE;${EOL}`);
    } else {
      out.write(`${line}${EOL}`, "utf8");
    }
  });
}

/**
 * Restores database data from a backup.
 */
async function restore(options?: {
  env?: string;
  schema?: string;
  fromEnv?: string;
  args?: string[];
}) {
  // Find the latest backup file for the selected environment
  const files = await readdir(backupsDir);
  let file = files
    .sort()
    .reverse()
    .filter((x) => x.endsWith(".sql"))
    .find((file) => {
      return options?.fromEnv
        ? file.endsWith(`_${options.fromEnv}.sql`)
        : !file.includes("_");
    });

  if (!file) {
    throw new Error("Backup file not found.");
  }

  file = relative(process.cwd(), resolve(backupsDir, file));

  const db = getDatabase(options);
  const { current_database } = await db
    .select(db.raw("current_database()"))
    .first()
    .finally(() => db.destroy());

  const fileName = chalk.greenBright(file);
  const dbName = chalk.greenBright(current_database);
  console.log(`Restoring ${fileName} to ${dbName}...`);

  await execa(
    "psql",
    [
      "--file",
      file,
      "--echo-errors",
      "--no-readline",
      ...(options?.args ?? []),
    ],
    { stdio: "inherit" },
  );
}

/**
 * Generates TypeScript types from a live PostgreSQL database.
 * @see https://github.com/kristiandupont/kanel#readme
 */
async function types(options?: { env?: string; schema?: string }) {
  const schema = options?.schema ?? "public";
  loadEnv(options?.env);

  const { processDatabase, defaultGetMetadata, generateIndexFile } = kanel;
  const { defaultZodTypeMap, defaultGetZodSchemaMetadata } = kanelZod;
  const { defaultGetZodIdentifierMetadata, makeGenerateZodSchemas } = kanelZod;

  const generateZodSchemas = makeGenerateZodSchemas({
    getZodSchemaMetadata: defaultGetZodSchemaMetadata,
    getZodIdentifierMetadata: defaultGetZodIdentifierMetadata,
    zodTypeMap: {
      ...defaultZodTypeMap,
      "pg_catalog.tsvector": "z.set(z.string())",
    },
    castToSchema: true,
  });

  // Generate TypeScript types from a live PostgreSQL database.
  // https://github.com/kristiandupont/kanel#readme
  await processDatabase({
    connection: {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT!),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    },

    outputPath: relative(process.cwd(), modelsDir),
    resolveViews: true,
    preDeleteOutputFolder: true,

    getMetadata(details, generateFor, config) {
      const meta = defaultGetMetadata(details, generateFor, config);
      return Object.assign(meta, {
        path: meta.path.replace(`/${schema}/`, "/"),
      });
    },

    preRenderHooks: [generateZodSchemas, generateIndexFile],

    customTypeMap: {
      "pg_catalog.tsvector": "Set<string>",
      "pg_catalog.bpchar": "string",
      "public.citext": "string",
      "public.uuid": "string",
    },

    typeFilter({ kind, name }) {
      if (kind === "table" && name === "migration") return false;
      if (kind === "table" && name === "migration_lock") return false;
      return true;
    },
  });
}
