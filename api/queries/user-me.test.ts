/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import request from "supertest";
import { createIdToken } from "../core/auth.js";
import { db } from "../core/index.js";
import { api } from "../index.js";

test(`fetch me (as anonymous)`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query {
          me { id email }
        }
      `,
    });

  expect({
    status: res.status,
    contentType: res.get("Content-Type"),
    body: res.body,
  }).toEqual({
    status: 200,
    contentType: "application/json",
    body: {
      data: {
        me: null,
      },
    },
  });
});

test(`fetch me (as a registered user)`, async () => {
  const res = await request(api)
    .post("/api")
    .auth(await createIdToken("test1"), { type: "bearer" })
    .send({
      query: `#graphql
        query {
          me { id email }
        }
      `,
    });

  expect({
    status: res.status,
    contentType: res.get("Content-Type"),
    body: res.body,
  }).toEqual({
    status: 200,
    contentType: "application/json",
    body: {
      data: {
        me: {
          id: "VXNlcjp0ZXN0MQ==",
          email: "jaylon.johns@example.com",
        },
      },
    },
  });
});

afterAll(() => db.destroy());
