/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { ErrorRequestHandler } from "express";
import express from "express";
import { getAuth } from "firebase-admin/auth";
import request from "supertest";
import { createIdToken } from "./auth.js";
import { session } from "./session.js";

jest.setTimeout(30000);

const uid = "test-bulqp";
const app = express();

app.use(session);

app.get("/me", (req, res) => {
  res.send({ token: req.token });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message, cause: err.cause?.message });
};

app.use(handleError);

beforeAll(async () => {
  await getAuth()
    .createUser({
      uid,
      email: `${uid}@example.com`,
      emailVerified: true,
    })
    .catch((err) =>
      err.code === "auth/uid-already-exists"
        ? Promise.resolve()
        : Promise.reject(err),
    );
  await getAuth()
    .createUser({
      uid: `${uid}-disabled`,
      email: `${uid}-disabled@example.com`,
      emailVerified: true,
    })
    .catch((err) =>
      err.code === "auth/uid-already-exists"
        ? Promise.resolve()
        : Promise.reject(err),
    );
});

afterAll(async () => {
  await getAuth().deleteUser(uid);
  await getAuth().deleteUser(`${uid}-disabled`);
});

test(`session: anonymous`, async () => {
  const res = await request(app).get("/me");

  expect({ status: res.status, body: res.body }).toEqual({
    status: 200,
    body: { token: null },
  });
});

test(`session: authenticated`, async () => {
  const idToken = await createIdToken(uid);
  const res = await request(app).get("/me").auth(idToken, { type: "bearer" });

  expect({ status: res.status, body: res.body }).toEqual({
    status: 200,
    body: {
      token: expect.objectContaining({
        sub: uid,
        email: `${uid}@example.com`,
        email_verified: true,
      }),
    },
  });
});

test(`session: disabled`, async () => {
  const idToken = await createIdToken(`${uid}-disabled`);
  await getAuth().updateUser(`${uid}-disabled`, { disabled: true });
  let res = await request(app).get("/me").auth(idToken, { type: "bearer" });

  expect({ status: res.status, body: res.body }).toEqual({
    status: 200,
    body: {
      token: expect.objectContaining({
        sub: `${uid}-disabled`,
        email: `${uid}-disabled@example.com`,
        email_verified: true,
      }),
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  res = await request(app).get("/me").auth(idToken, { type: "bearer" });

  expect({ status: res.status, body: res.body }).toEqual({
    status: 401,
    body: {
      error: "Unauthorized",
      cause: "The user record is disabled.",
    },
  });
});

test(`session: invalid token`, async () => {
  const res = await request(app).get("/me").auth("xxx", { type: "bearer" });

  expect({ status: res.status, body: res.body }).toEqual({
    status: 401,
    body: {
      error: "Unauthorized",
      cause: expect.stringContaining("Decoding Firebase ID token failed"),
    },
  });
});
