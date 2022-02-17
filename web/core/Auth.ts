/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { useCallback } from "react";
import {
  Environment,
  fetchQuery,
  graphql,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import {
  createOperationDescriptor,
  createReaderSelector,
  getFragment,
  getRequest,
  getSingularSelector,
  ROOT_ID,
  Snapshot,
} from "relay-runtime";
import type { AuthQuery } from "../queries/AuthQuery.graphql";
import { AuthSignOutMutation } from "../queries/AuthSignOutMutation.graphql";
import { Auth_user$data } from "../queries/Auth_user.graphql";

type LoginMethod = "Google" | "Facebook";

const query = graphql`
  query AuthQuery {
    ...Auth_me
  }
`;

const meFragment = getFragment(graphql`
  fragment Auth_me on Root {
    me {
      ...Auth_user
    }
  }
`);

const userFragment = getFragment(graphql`
  fragment Auth_user on User {
    id
    username
    email
    name
    picture {
      url
    }
  }
`);

const signOutMutation = graphql`
  mutation AuthSignOutMutation {
    signOut
  }
`;

const variables = {};
const { request } = createOperationDescriptor(getRequest(query), variables);
const selector = createReaderSelector(meFragment, ROOT_ID, variables, request);

type User = Auth_user$data | null;

function getCurrentUser(
  relay: Environment,
  snap?: Snapshot,
): User | null | undefined {
  snap = snap ?? relay.lookup(selector);

  if (snap.isMissingData) return undefined;
  if (!snap.data?.me) return null;

  const userSelector = getSingularSelector(userFragment, snap.data.me);
  snap = relay.lookup(userSelector);

  if (snap.isMissingData) return undefined;
  return snap.data as User | null;
}

function useSignOut(): () => Promise<void> {
  const [commit] = useMutation<AuthSignOutMutation>(signOutMutation);

  return useCallback(
    function () {
      return new Promise((resolve, reject) => {
        commit({
          variables: {},
          onCompleted(_, errors) {
            const err = errors?.[0];
            if (err) {
              reject(err);
            } else {
              window.location.href = "/";
              resolve();
            }
          },
          onError(err) {
            reject(err);
          },
        });
      });
    },
    [commit],
  );
}

function useFetchUser(): () => Promise<User | null> {
  const relay = useRelayEnvironment();
  return React.useCallback(
    function auth() {
      return fetchQuery<AuthQuery>(relay, query, variables, {
        networkCacheConfig: { force: true },
        fetchPolicy: "network-only",
      })
        .toPromise()
        .then(() => getCurrentUser(relay, relay.lookup(selector)) ?? null);
    },
    [relay],
  );
}

export {
  getCurrentUser,
  query,
  selector,
  useFetchUser,
  useSignOut,
  variables,
  type AuthQuery,
  type LoginMethod,
  type User,
};
