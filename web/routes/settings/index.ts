/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { graphql } from "relay-runtime";

import type Settings from "./Settings";
import type { Route } from "../../core";
import type { settingsQueryResponse } from "./__generated__/settingsQuery.graphql";

/**
 * User account settings route.
 */
export default {
  path: "/settings",
  query: graphql`
    query settingsQuery {
      me {
        id
        name
        email
      }
    }
  `,
  component: () => import(/* webpackChunkName: "settings" */ "./Settings"),
  response: (data) => ({
    title: "Account Settings",
    props: data,
  }),
} as Route<typeof Settings, settingsQueryResponse>;
