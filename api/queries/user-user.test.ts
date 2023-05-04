/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getAuth } from "firebase-admin/auth";
import { toGlobalId } from "graphql-relay";
import request from "supertest";
import { createIdToken } from "../core/auth.js";
import { api } from "../index.js";

const userId = "test-633285";
const globalUserId = toGlobalId("User", userId);

beforeAll(async () => {
  await getAuth()
    .createUser({
      uid: userId,
      displayName: "Test User",
      email: `${userId}@example.com`,
      emailVerified: true,
    })
    .catch((err) =>
      err.code === "auth/uid-already-exists"
        ? Promise.resolve()
        : Promise.reject(err),
    );
});

afterAll(async () => {
  await getAuth().deleteUser(userId);
});

test(`fetch user(id: "none")`, async () => {
  const res = await request(api)
    .post("/api")
    .send({
      query: `#graphql
        query Q($id: ID!) {
          user: node(id: $id) {
            ... on User {
              id
              email
            }
          }
        }
      `,
      variables: { id: toGlobalId("User", "none") },
    });

  expect({ status: res.status, ...res.body }).toEqual({
    status: 200,
    data: {
      user: null,
    },
  });
});

test(`fetch user(email: "${userId}@example.com")`, async () => {
  const idToken = await createIdToken(userId);
  const res = await request(api)
    .post("/api")
    .auth(idToken, { type: "bearer" })
    .send({
      query: `#graphql
        query Q($email: String!) {
          user(email: $email) { id email }
        }
      `,
      variables: { email: `${userId}@example.com` },
    });

  expect({ status: res.status, body: res.body }).toEqual({
    status: 200,
    body: {
      data: {
        user: {
          id: globalUserId,
          email: `${userId}@example.com`,
        },
      },
    },
  });
});

test(`fetch user: node(id: "${globalUserId}")`, async () => {
  const idToken = await createIdToken(userId);
  const res = await request(api)
    .post("/api")
    .auth(idToken, { type: "bearer" })
    .send({
      query: `#graphql
        query Q($id: ID!) {
          user: node(id: $id) {
            ... on User {
              id
              email
            }
          }
        }
      `,
      variables: { id: globalUserId },
    });

  expect({ status: res.status, body: res.body }).toEqual({
    status: 200,
    body: {
      data: {
        user: {
          id: globalUserId,
          email: `${userId}@example.com`,
        },
      },
    },
  });
});
