/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import DataLoader from "dataloader";
import { Request } from "express";
import { Auth, DecodedIdToken, UserRecord, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { GraphQLParams } from "./core/helix";
import { LogSeverity, log } from "./core/logging";

/**
 * GraphQL execution context.
 * @see https://graphql.org/learn/execution/
 */
export class Context extends Map<symbol, unknown> {
  readonly req: Request;
  readonly params: GraphQLParams;
  readonly token: DecodedIdToken | null;
  readonly auth: Auth;
  readonly db: Firestore;

  constructor(req: Request, params: GraphQLParams) {
    super();
    this.req = req;
    this.params = params;
    this.token = req.token;
    this.auth = getAuth();
    this.db = getFirestore();
  }

  log(
    severity: LogSeverity,
    data: string | Record<string, unknown> | Error,
  ): void {
    log(this.req, severity, data, this.params);
  }

  /*
   * Data loaders
   * ------------------------------------------------------------------------ */

  userById = new DataLoader<string, UserRecord | null>((keys) =>
    Promise.all(keys.map((id) => this.auth.getUser(id).catch(() => null))),
  );
}
