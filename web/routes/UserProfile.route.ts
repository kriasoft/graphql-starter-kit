/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "relay-runtime";
import { type Route } from "../core";
import { type UserProfileQuery } from "../queries/UserProfileQuery.graphql";
import { type UserProfile } from "./UserProfile";

/**
 * User profile (e.g. https://example.com/u/koistya)
 *
 * @see https://github.com/pillarjs/path-to-regexp
 */
export default {
  path: "/u/:username(\\w+)",
  query: graphql`
    query UserProfileQuery($username: String!) {
      user(username: $username) {
        id
        name
        email
        username
        picture {
          url
        }
      }
    }
  `,
  component: () => import(/* webpackChunkName: "profile" */ "./UserProfile"),
  response: (data) =>
    data.user && {
      title: `${data.user.name} (@${data.user.username}) · React App`,
      props: data,
    },
} as Route<UserProfile, UserProfileQuery>;
