/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import express from "express";
import { getAuth } from "firebase-admin/auth";
import request from "supertest";
import { createIdToken } from "./auth.js";
import { db } from "./db.js";
import { session } from "./session.js";

jest.setTimeout(30000);

const uid = "test-bulqp";
const app = express();

app.use(session);

app.get("/me", (req, res) => {
  res.send({ user: req.user });
});

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
});

afterAll(async () => {
  await getAuth().deleteUser(uid);
  await db.from("user").where({ id: uid }).delete();
  await db.destroy();
});

test(`session: anonymous`, async () => {
  const res = await request(app).get("/me").expect(200);
  expect(res.body).toEqual({ user: null });
});

test(`session: authenticated`, async () => {
  const idToken = await createIdToken(uid);
  const res = await request(app)
    .get("/me")
    .auth(idToken, { type: "bearer" })
    .expect(200);

  expect(res.body).toEqual({
    user: expect.objectContaining({
      id: uid,
      email: `${uid}@example.com`,
      email_verified: true,
    }),
  });
});
