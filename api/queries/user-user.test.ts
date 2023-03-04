/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import request from "supertest";
import { createIdToken } from "../core/auth.js";
import { api, db } from "../index.js";

beforeAll(async () => {
  await db
    .table("user")
    .insert({
      id: "test01",
      email: "test01@example.com",
    })
    .onConflict("id")
    .merge();
});

afterAll(async () => {
  await db.table("user").where({ id: "test01" }).delete();
  await db.destroy();
});

test(`fetch user(id: "none")`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query {
          user: node(id: "VXNlcjpub25l") {
            ... on User {
              id
              email
            }
          }
        }
      `,
    });

  expect({ status: res.status, ...res.body }).toEqual({
    status: 200,
    data: {
      user: null,
    },
  });
});

test(`fetch user(email: "test01")`, async () => {
  const idToken = await createIdToken("test01");
  const res = await request(api)
    .post("/api")
    .auth(idToken, { type: "bearer" })
    .send({
      query: `#graphql
        query {
          user(email: "test01@example.com") { id email }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toEqual({
    data: {
      user: {
        id: "VXNlcjp0ZXN0MDE=",
        email: "test01@example.com",
      },
    },
  });
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
            }
          }
        }
      `,
    })
    .expect(200)
    .expect("Content-Type", "application/json");

  expect(res.body).toEqual({
    data: {
      user: {
        id: "VXNlcjp0ZXN0MDE=",
        email: null,
      },
    },
  });
});
