/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getAuth } from "firebase-admin/auth";
import { toGlobalId } from "graphql-relay";
import request from "supertest";
import { afterAll, beforeAll, expect, test } from "vitest";
import { createIdToken } from "../core/auth.js";
import { api } from "../index.js";

const userId = "test-223274";

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
    .auth(await createIdToken(userId), { type: "bearer" })
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
          id: toGlobalId("User", userId),
          email: `${userId}@example.com`,
        },
      },
    },
  });
});
