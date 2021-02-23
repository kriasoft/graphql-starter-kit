/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { graphql } from "relay-runtime";

import type Home from "./Home";
import type { Route } from "../../core";
import type { homeQueryResponse } from "./__generated__/homeQuery.graphql";

/**
 * Homepage route.
 */
export default {
  path: "/",
  query: graphql`
    query homeQuery {
      me {
        id
        name
        email
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
