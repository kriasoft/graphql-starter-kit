/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import request from "supertest";
import { createIdToken, db } from "../core";
import { api } from "../index";

test(`fetch me (as anonymous)`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query {
          me { id email }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "me": null,
      },
    }
  `);
});

test(`fetch me (as a registered user)`, async () => {
  const res = await request(api)
    .post("/api")
    .auth(await createIdToken({ id: "test1" }), { type: "bearer" })
    .send({
      query: `#graphql
        query {
          me { id email }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "me": Object {
          "email": "jaylon.johns@example.com",
          "id": "VXNlcjp0ZXN0MQ==",
        },
      },
    }
  `);
});

afterAll(() => db.destroy());
