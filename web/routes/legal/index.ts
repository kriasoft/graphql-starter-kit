/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type Terms from "./Terms";
import type Privacy from "./Privacy";
import type { Route } from "../../core";

export default [
  {
    path: "/privacy",
    component: () => import(/* webpackChunkName: "legal" */ "./Privacy"),
    response: () => ({
      title: "Privacy Policy",
    }),
  } as Route<typeof Privacy>,

  {
    path: "/terms",
    component: () => import(/* webpackChunkName: "legal" */ "./Terms"),
    response: () => ({
      title: "Privacy Policy",
    }),
  } as Route<typeof Terms>,
];
