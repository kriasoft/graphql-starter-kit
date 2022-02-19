/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import request from "supertest";
import { api, db } from "../index";

beforeAll(async () => {
  await db
    .table("user")
    .insert({
      id: "test01",
      username: "test01",
      email: "test01@example.com",
    })
    .onConflict("id")
    .merge();
});

afterAll(async () => {
  await db.table("user").where({ id: "test01" }).delete();
  await db.destroy();
});

test(`fetch user(username: "none")`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query {
          user(username: "none") { id email username }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "user": null,
      },
    }
  `);
});

test(`fetch user(username: "test01")`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query {
          user(username: "test01") { id email username }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "user": Object {
          "email": null,
          "id": "VXNlcjp0ZXN0MDE=",
          "username": "test01",
        },
      },
    }
  `);
});

test(`fetch user: node(id: "VXNlcjp0ZXN0MDE=")`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query {
          user: node(id: "VXNlcjp0ZXN0MDE=") {
            ... on User {
              id
              email
              username
            }
          }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "user": Object {
          "email": null,
          "id": "VXNlcjp0ZXN0MDE=",
          "username": "test01",
        },
      },
    }
  `);
});
