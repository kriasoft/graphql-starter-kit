/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { graphql, useMutation } from "react-relay";
import { useAuthSignOutMutation as SignOutMutation } from "./__generated__/useAuthSignOutMutation.graphql";

const signOutMutation = graphql`
  mutation useAuthSignOutMutation {
    signOut
  }
`;

export function useSignOut(): () => void {
  const [commit] = useMutation<SignOutMutation>(signOutMutation);
  return React.useCallback(
    function () {
      commit({
        variables: {},
        onCompleted(_, errors) {
          if (errors) throw errors[0];
          window.location.reload();
        },
      });
    },
    [commit],
  );
}
