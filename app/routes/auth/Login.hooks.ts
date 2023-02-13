import { signInWithCustomToken } from "firebase/auth";
import * as React from "react";
import { Disposable, graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router-dom";
import { auth, signIn, SignInMethod } from "../../core/firebase.js";
import { LoginMutation } from "../../queries/LoginMutation.graphql.js";

/**
 * Handles login / signup via Email
 */
export function useHandleSubmit(state: State, setState: SetState) {
  const navigate = useNavigate();
  const [commit, inFlight] = useMutation<LoginMutation>(
    graphql`
      mutation LoginMutation($input: SignInInput!) {
        signIn(input: $input) {
          newUser
          emailVerified
          registered
          otpSent
          token
          saml
        }
      }
    `,
  );

  const self = React.useRef<Disposable>();

  React.useEffect(() => () => self.current?.dispose(), []);

  const submit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      self.current = commit({
        variables: {
          input: {
            email: state.email,
            otp: state.code,
            saml: state.saml,
          },
        },
        onCompleted(res, errors) {
          const error = errors?.[0]?.message;

          if (error) {
            setState((prev) => ({ ...prev, error, code: "" }));
          } else if (res.signIn?.token) {
            signInWithCustomToken(auth, res.signIn.token)
              .then(() => {
                navigate("/");
              })
              .catch((err) => {
                setState((prev) => ({
                  ...prev,
                  error: err.message,
                  otpSent: false,
                  code: "",
                }));
              });
          } else {
            setState((prev) => ({
              ...prev,
              otpSent: res.signIn?.otpSent,
              code: "",
              error: null,
            }));
          }
        },
      });
    },
    [setState, navigate, commit, state.email, state.code, state.saml],
  );

  return [submit, inFlight] as const;
}

/**
 * The initial state of the Login component
 */
export function useState(props: Props) {
  return React.useState({
    mode: props.mode,
    email: "",
    code: "",
    saml: false,
    otpSent: undefined as boolean | null | undefined,
    error: undefined as string | null | undefined,
  });
}

export function useHandleChange(setState: SetState) {
  return React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target as Input;
      setState((prev) =>
        prev[name] === value ? prev : { ...prev, [name]: value },
      );
    },
    [setState],
  );
}

export function useSwitchSAML(setState: SetState) {
  return React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setState((prev) => ({
        ...prev,
        saml: !prev.saml,
        otpSent: false,
        code: "",
      }));
    },
    [setState],
  );
}

export function useHandleSignIn(setState: SetState) {
  const navigate = useNavigate();

  return React.useCallback(
    async function (event: React.MouseEvent<HTMLElement>) {
      try {
        const method = event.currentTarget.dataset.method as SignInMethod;
        const credential = await signIn({ method });
        if (credential.user) {
          setState((prev) => (prev.error ? { ...prev, error: null } : prev));
          navigate("/");
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Login failed.";
        setState((prev) => ({ ...prev, error }));
      }
    },
    [navigate, setState],
  );
}

export type Props = {
  mode: "login" | "signup";
};

export type State = ReturnType<typeof useState>[0];
export type SetState = ReturnType<typeof useState>[1];
export type Input = { name: keyof State; value: string };
