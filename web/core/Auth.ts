/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import {
  fetchQuery,
  graphql,
  useFragment,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { createOperationDescriptor, getRequest, Snapshot } from "relay-runtime";
import { AuthQuery } from "./__generated__/AuthQuery.graphql";
import { AuthSignOutMutation } from "./__generated__/AuthSignOutMutation.graphql";
import { Auth_me$data, Auth_me$key } from "./__generated__/Auth_me.graphql";

const query = graphql`
  query AuthQuery {
    me {
      ...Auth_me
    }
  }
`;

const meFragment = graphql`
  fragment Auth_me on User {
    id
    username
    email
    emailVerified
    name
    givenName
    familyName
    picture {
      url
    }
    timeZone
    locale
    created
    updated
    lastLogin
  }
`;

const signOutMutation = graphql`
  mutation AuthSignOutMutation {
    signOut
  }
`;

const variables = {};
const operation = createOperationDescriptor(getRequest(query), variables);

export type User = Auth_me$data | null;

class Auth {
  readonly signInCallbacks = new Set<() => void>();

  signIn(): void {
    if (this.signInCallbacks.size === 0) throw new Error();
    this.signInCallbacks.forEach((fn) => fn());
  }

  signOut(): void {
    throw new Error();
  }

  listen(event: "signIn", callback: () => void): () => void {
    if (this.signInCallbacks.has(callback)) throw new Error();
    this.signInCallbacks.add(callback);
    return this.signInCallbacks.delete.bind(this.signInCallbacks, callback);
  }
}

export const auth = new Auth();

export function useAuth(): Auth {
  const [commitSignOut] = useMutation<AuthSignOutMutation>(signOutMutation);

  const signOut = React.useCallback(
    function () {
      commitSignOut({
        variables: {},
        onCompleted(_, errors) {
          if (errors) throw errors[0];
          window.location.reload();
        },
      });
    },
    [commitSignOut],
  );

  return React.useMemo(() => Object.assign(auth, { signOut }), [auth, signOut]);
}

export function useCurrentUser(options = { forceFetch: false }): User {
  const forceFetch =
    typeof options.forceFetch === "boolean" ? options.forceFetch : false;
  const relay = useRelayEnvironment();

  // Attempt to read the current user record (me) from the local store.
  const [snap, setSnap] = React.useState<Snapshot>(() =>
    relay.lookup(operation.fragment),
  );

  // Subscribe to updates
  React.useEffect(() => {
    const subscription = relay.subscribe(snap, (x) => setSnap(x));
    return () => subscription.dispose();
  }, [relay]);

  // Once the component is mounted, attempt to load user record from the API.
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchQuery<AuthQuery>(relay, query, variables, {
        networkCacheConfig: { force: forceFetch },
        fetchPolicy: "store-or-network",
      }).toPromise();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [relay, forceFetch]);

  const me = useFragment(meFragment, snap.data.me as Auth_me$key);
  return snap.data.me === undefined ? undefined : me;
}
