/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { graphql, useMutation } from "react-relay/hooks";

import { useAuthSignOutMutation as SignOutMutation } from "./__generated__/useAuthSignOutMutation.graphql";

export type AuthProvider = "google" | "apple" | "facebook";

export type Auth = {
  signIn: (provider: AuthProvider) => void;
  signOut: () => void;
};

const signOutMutation = graphql`
  mutation useAuthSignOutMutation {
    signOut
  }
`;

export function useAuth(): Auth {
  const [signOut] = useMutation<SignOutMutation>(signOutMutation);

  return React.useMemo<Auth>(function createAuth() {
    return {
      signIn(provider) {
        const { pathname, search } = window.location;
        window.localStorage?.setItem("return", `${pathname}${search}`);
        window.location.href = `/auth/${provider}`;
      },

      signOut() {
        signOut({
          variables: {},
          onCompleted(_, errors) {
            if (errors) {
              throw errors[0];
            } else {
              window.location.reload();
            }
          },
        });
      },
    };
  }, []);
}
