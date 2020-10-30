/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { createOperationDescriptor, getRequest } from "relay-runtime";
import { graphql, useRelayEnvironment, fetchQuery } from "react-relay/hooks";

import type {
  useCurrentUserQuery as Query,
  useCurrentUserQueryResponse as Response,
} from "./__generated__/useCurrentUserQuery.graphql";

export type User = NonNullable<Response["me"]>;

const variables = {};
const query = graphql`
  query useCurrentUserQuery {
    me {
      id
      name
      email
      picture
    }
  }
`;

const operation = createOperationDescriptor(getRequest(query), variables);

/**
 * Returns the currently logged in user object (`me`), `null` for anonymous
 * users, and `undefined` when the user status has not been resolved yet.
 */
export function useCurrentUser(forceFetch = false): User | null | undefined {
  const relay = useRelayEnvironment();

  // Attempt to read the current user record (me) from the local store.
  const snapshot = relay.lookup(operation.fragment);
  const [user, setUser] = React.useState<User>(snapshot.data.me as User);

  // Once the component is mounted, attempt to load user record from the API.
  React.useEffect(() => {
    const queryRef = fetchQuery<Query>(relay, query, variables, {
      networkCacheConfig: { force: forceFetch || snapshot.isMissingData },
    }).subscribe({
      error(err: Error) {
        console.error(err);
      },
    });

    const retain = relay.retain(operation);
    const subscribe = relay.subscribe(snapshot, ({ data }) => {
      setUser(data.me as User);
    });

    return function dispose() {
      queryRef.unsubscribe();
      subscribe.dispose();
      retain.dispose();
    };
  }, [relay, forceFetch]);

  return user;
}
