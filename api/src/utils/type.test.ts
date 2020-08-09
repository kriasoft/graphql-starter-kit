/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { assignType, getType } from "./type";

test("assignType()", () => {
  const obj = {} as Record<string, unknown>;
  const result1 = assignType("Test")(obj);
  const result2 = assignType("Test")(null);
  const result3 = assignType("Test")(undefined);
  expect(obj.__type).toBe("Test");
  expect(result1).toEqual(obj);
  expect(result2).toBeNull();
  expect(result3).toBeUndefined();
});

test("getType()", () => {
  const result1 = getType({ __type: "Test" });
  const result2 = getType({});
  const result3 = getType(undefined);
  expect(result1).toBe("Test");
  expect(result2).toBeUndefined();
  expect(result3).toBeUndefined();
});
