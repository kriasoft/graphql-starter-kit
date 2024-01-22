/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { describe, expect, it } from "vitest";
import { fetchCertificates } from "./auth";

describe("fetchCertificates()", () => {
  it("should fetch certificates from Google", async () => {
    const certs = await fetchCertificates();
    expect(certs).toEqual(expect.any(Object));
    expect(Object.values(certs)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^-----BEGIN CERTIFICATE-----/),
      ]),
    );
  });
});
