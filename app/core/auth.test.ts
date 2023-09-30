import { expect, test } from "vitest";

test("example", () => {
  expect(document.location).toMatchInlineSnapshot('"http://localhost:3000/"');
});
