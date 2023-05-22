import { expect, test } from "vitest";

test("example", () => {
  expect(document.location).toMatchInlineSnapshot('"about:blank"');
});
