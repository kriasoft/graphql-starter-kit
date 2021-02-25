/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { graphql } from "relay-runtime";

import type UserProfile from "./UserProfile";
import type { Route } from "../../core";
import type { userProfileQueryResponse } from "./__generated__/userProfileQuery.graphql";

/**
 * User profile (e.g. https://example.com/@koistya)
 *
 * @see https://github.com/pillarjs/path-to-regexp
 */
export default {
  path: "/@:username(\\w+)",
  query: graphql`
    query userProfileQuery($username: String!) {
      user(username: $username) {
        id
        name
        email
        username
        picture
      }
    }
  `,
  component: () => import(/* webpackChunkName: "profile" */ "./UserProfile"),
  response: (data) => ({
    title: "User Profile",
    props: data,
  }),
} as Route<typeof UserProfile, userProfileQueryResponse>;
