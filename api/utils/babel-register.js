/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const path = require("path");

require("@babel/register")({
  only: [(file) => !file.includes(`${path.sep}.yarn${path.sep}`)],
  extensions: [".ts", ".js"],
  rootMode: "upward",
  cache: false,
});
