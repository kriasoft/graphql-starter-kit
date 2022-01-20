/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "relay-runtime";
import type { Route } from "../../core";
import type { homeQueryResponse } from "../../queries/homeQuery.graphql";
import type Home from "./Home";

/**
 * Homepage route.
 */
export default {
  path: "/",
  query: graphql`
    query homeQuery {
      me {
        ...Auth_user
      }
    }
  `,
  component: () => import(/* webpackChunkName: "home" */ "./Home"),
  response: (data) => ({
    title: "React App",
    description: "Web application built with React and Relay",
    props: data,
  }),
} as Route<typeof Home, homeQueryResponse>;
