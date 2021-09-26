/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { mapTo, mapToMany, mapToManyValues, mapToValues } from "./map";

test("mapTo()", () => {
  const result = mapTo(
    [
      { id: 2, name: "b" },
      { id: 1, name: "a" },
    ],
    [1, 2],
    (x) => x.id,
  );
  expect(result).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": 1,
        "name": "a",
      },
      Object {
        "id": 2,
        "name": "b",
      },
    ]
  `);
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
  expect(result).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "id": 1,
          "name": "a",
        },
        Object {
          "id": 1,
          "name": "c",
        },
      ],
      Array [
        Object {
          "id": 2,
          "name": "b",
        },
      ],
    ]
  `);
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
  expect(result).toMatchInlineSnapshot(`
    Array [
      "a",
      "b",
      "c",
      null,
    ]
  `);
});

test("mapToManyValues()", () => {
  const result = mapToManyValues(
    [
      { id: 2, name: "b" },
      { id: 2, name: "c" },
      { id: 1, name: "a" },
    ],
    [1, 2],
    (x) => x.id,
    (x) => x?.name || null,
  );
  expect(result).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
      ],
      Array [
        "b",
        "c",
      ],
    ]
  `);
});
