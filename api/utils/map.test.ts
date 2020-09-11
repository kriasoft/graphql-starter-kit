/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { mapTo, mapToMany, mapToValues } from "./map";

test("mapTo()", () => {
  const result = mapTo(
    [
      { id: 2, name: "b" },
      { id: 1, name: "a" },
    ],
    [1, 2],
    (x) => x.id,
  );
  expect(result).toMatchSnapshot();
});

test("mapToMany()", () => {
  const result = mapToMany(
    [
      { id: 2, name: "b" },
      { id: 1, name: "a" },
      { id: 1, name: "c" },
    ],
    [1, 2],
    (x) => x.id,
  );
  expect(result).toMatchSnapshot();
});

test("mapToValues()", () => {
  const result = mapToValues(
    [
      { id: 2, name: "b" },
      { id: 1, name: "a" },
      { id: 3, name: "c" },
    ],
    [1, 2, 3, 4],
    (x) => x.id,
    (x) => x?.name || null,
  );
  expect(result).toMatchSnapshot();
});
