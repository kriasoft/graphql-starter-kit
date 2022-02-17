/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Route } from "../core";
import { type Privacy } from "./LegalPrivacy";
import { type Terms } from "./LegalTerms";

export default [
  {
    path: "/privacy",
    component() {
      return import(/* webpackChunkName: "legal.privacy" */ "./LegalPrivacy");
    },
    response: () => ({
      title: "Privacy Policy · React App",
    }),
  } as Route<Privacy>,

  {
    path: "/terms",
    component() {
      return import(/* webpackChunkName: "legal.terms" */ "./LegalTerms");
    },
    response: () => ({
      title: "Terms of Use · React App",
    }),
  } as Route<Terms>,
];
