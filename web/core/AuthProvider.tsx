/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { fetchQuery, useRelayEnvironment } from "react-relay";
import { LoginDialog } from "../dialogs";
import type { AuthQuery, LoginMethod, User } from "./Auth";
import {
  getCurrentUser,
  query,
  selector,
  useFetchUser,
  useSignOut,
  variables,
} from "./Auth";

type Auth = {
  /**
   * The currently logged in user object. Or:
   *   - `null` when the user is anonymous
   *   - `undefined` when the authentication status is unknown
   */
  me: User | null | undefined;
  /**
   * Opens a login dialog.
   *
   * @example
   *   signIn() — opens a modal dialog with sign in options
   *   signIn({ method: "GitHub" }) — opens GitHub sign in window
   *   signIn({ type: "onboarding" }) — opens a customized sign in dialog
   */
  signIn: (options?: SignInOptions) => Promise<User | null>;
  /** Clears the authenticated session. */
  signOut: () => Promise<void>;
  /** Fetches the current user info from the API. */
  fetch: () => Promise<User | null>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

type SignInOptions = { method?: LoginMethod };
type SignInState = SignInOptions & { open: boolean; error?: string };
type SignInCallback = [
  resolve: (user: User | null) => void,
  reject: (err: Error) => void,
];

const AuthContext = React.createContext<Auth>({
  me: undefined as User | null | undefined,
  signIn: () => Promise.resolve(null),
  signOut: () => Promise.resolve(),
  fetch: () => Promise.resolve(null),
});

// Pop-up window for Google/Facebook authentication
let loginWindow: WindowProxy | null = null;

function AuthProvider(props: AuthProviderProps): JSX.Element {
  const [state, setState] = React.useState<SignInState>({ open: false });
  const callbackRef = React.useRef<SignInCallback>();
  const relay = useRelayEnvironment();
  const signOut = useSignOut();
  const fetch = useFetchUser();

  // Attempt to read the current user record (me) from the local store.
  const [snap, setSnap] = React.useState(() => relay.lookup(selector));

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { method, error, ...loginState } = state;

  // Subscribe to updates
  React.useEffect(() => {
    const subscription = relay.subscribe(snap, setSnap);
    return () => subscription.dispose();
  }, [relay]);

  // Once the component is mounted, attempt to load user info from the API.
  React.useEffect(() => {
    fetchQuery<AuthQuery>(relay, query, variables, {
      fetchPolicy: "store-or-network",
    }).toPromise();
  }, [relay]);

  // Start listening for notifications from the pop-up login window
  React.useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === loginWindow
      ) {
        if (event.data.error) {
          setState((prev) => ({
            ...prev,
            open: true,
            error: event.data.error,
          }));
          callbackRef.current?.[1](new Error(event.data.error));
        } else if (event.data.user) {
          fetch().then((user) => {
            setState({ open: false });
            callbackRef.current?.[0](user ?? null);
          });
        } else {
          setState((prev) => ({ ...prev, open: true, register: true }));
        }
      }
    }

    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const signIn = React.useCallback<Auth["signIn"]>(function signIn(options) {
    return new Promise((resolve, reject) => {
      const callback = callbackRef.current;
      callbackRef.current = [
        (user) => {
          resolve(user);
          callback?.[0](user);
          callbackRef.current = undefined;
        },
        (err: Error) => {
          reject(err);
          callback?.[1](err);
          callbackRef.current = undefined;
        },
      ];

      if (options?.method) {
        const url = `/auth/${options.method.toLowerCase()}`;

        if (loginWindow === null || loginWindow.closed) {
          const width = 520;
          const height = 600;
          const left =
            (window.top?.outerWidth ?? 0) / 2 +
            (window.top?.screenX ?? 0) -
            width / 2;
          const top =
            (window.top?.outerHeight ?? 0) / 2 +
            (window.top?.screenY ?? 0) -
            height / 2;
          loginWindow = window.open(
            url,
            "login",
            `menubar=no,toolbar=no,status=no,width=${width},height=${height},left=${left},top=${top}`,
          );
        } else {
          loginWindow.focus();
          loginWindow.location.href = url;
        }
      } else {
        setState({ ...options, open: true });
      }
    });
  }, []);

  const auth = React.useMemo(
    () => ({ me: getCurrentUser(relay, snap), signIn, signOut, fetch }),
    [relay, snap],
  );

  const handleClose = React.useCallback(function handleClose() {
    setState({ open: false });
    callbackRef.current?.[0](null);
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {props.children}
      <LoginDialog {...loginState} onClose={handleClose} />
    </AuthContext.Provider>
  );
}

function useAuth(): Auth {
  return React.useContext(AuthContext);
}

function useAuthCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  deps: React.DependencyList,
): (...args: T) => void {
  const { me, signIn } = React.useContext(AuthContext);

  return React.useCallback((...args: T) => {
    (args[0] as React.SyntheticEvent)?.preventDefault?.();

    if (me) {
      callback(...args);
    } else {
      signIn().then((user) => {
        if (user) callback(...args);
      });
    }
  }, deps);
}

export { AuthProvider, AuthContext, useAuth, useAuthCallback };
