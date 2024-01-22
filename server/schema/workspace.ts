/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as Db from "db/models";
import { db } from "../core/db";
import { builder } from "./builder";

export const Workspace = builder.objectRef<Db.Workspace>("Workspace");

Workspace.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

builder.queryField("workspace", (t) =>
  t.field({
    type: Workspace,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve(_, args) {
      return db
        .from<Db.Workspace>("workspace")
        .where("id", "=", args.id)
        .first();
    },
  }),
);
