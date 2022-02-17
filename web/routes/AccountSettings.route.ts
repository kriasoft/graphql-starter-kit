/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { graphql } from "relay-runtime";
import { type Route } from "../core";
import { type AccountSettingsQuery } from "../queries/AccountSettingsQuery.graphql";
import { type AccountSettings } from "./AccountSettings";

/**
 * User account settings route.
 */
export default {
  path: "/settings",
  query: graphql`
    query AccountSettingsQuery {
      me {
        ...Auth_user
      }
    }
  `,
  authorize: true,
  component() {
    return import(/* webpackChunkName: "settings" */ "./AccountSettings");
  },
  response: (data) => ({
    title: "Account Settings · React App",
    props: data,
  }),
} as Route<AccountSettings, AccountSettingsQuery>;
