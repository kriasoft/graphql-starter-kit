/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getAuth } from "firebase-admin/auth";
import { createIdToken } from "./auth.js";

const uid = "test-kl5dp";

test("createIdToken(uid)", async () => {
  const idToken = await createIdToken(uid);
  expect(typeof idToken).toBe("string");
  expect(idToken.length).toBeGreaterThan(100);
  expect(idToken.length).toBeLessThan(2000);
});

afterAll(async () => {
  await getAuth().deleteUser(uid);
});
