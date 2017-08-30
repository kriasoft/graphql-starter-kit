#!/bin/sh -e

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "dev";
EOSQL

psql --variable=ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname=dev <<-EOSQL
  CREATE EXTENSION "uuid-ossp";
  CREATE EXTENSION "hstore";
EOSQL
