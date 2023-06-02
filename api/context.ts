/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import DataLoader from "dataloader";
import { Request, Response } from "express";
import { Auth, DecodedIdToken, UserRecord, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Request as GraphQLRequest, RequestParams } from "graphql-http";
import { LogSeverity, log } from "./core/logging";

/**
 * GraphQL execution context.
 * @see https://graphql.org/learn/execution/
 */
export class Context extends Map<string | number | symbol, unknown> {
  [key: string | number | symbol]: unknown;

  readonly req: Request;
  readonly operationName?: string;
  readonly query: string;
  readonly variables?: Record<string, unknown>;
  readonly extensions?: Record<string, unknown>;
  readonly token: DecodedIdToken | null;
  readonly auth: Auth;
  readonly db: Firestore;

  constructor(
    req: GraphQLRequest<Request, { res: Response }>,
    params: RequestParams,
  ) {
    super();
    this.req = req.raw;
    this.token = this.req.token;
    this.operationName = params.operationName;
    this.query = params.query;
    this.variables = params.variables;
    this.extensions = params.extensions;
    this.auth = getAuth();
    this.db = getFirestore();
  }

  log(
    severity: LogSeverity,
    data: string | Record<string, unknown> | Error,
  ): void {
    log(this.req, severity, data, {
      operationName: this.operationName,
      query: this.query,
    });
  }

  /*
   * Data loaders
   * ------------------------------------------------------------------------ */

  userById = new DataLoader<string, UserRecord | null>((keys) =>
    Promise.all(keys.map((id) => this.auth.getUser(id).catch(() => null))),
  );
}
