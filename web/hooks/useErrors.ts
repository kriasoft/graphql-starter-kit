/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { PayloadError } from "relay-runtime";

type Input = {
  [key: string]: string | number | null;
};

type Errors<T extends Input> = {
  [key in keyof T]?: string;
};

const empty: Errors<Input> = {};

/**
 * Creates an object with API mutation errors and function to update it.
 *
 * @example
 *   const [errors, setErrors] = useErrors();
 *   const [updateUser] = useMutation(updateUserMutation);
 *
 *   updateUser({
 *     input: { ... },
 *     onCompleted({ updateUser: data }, errors) {
 *       setErrors(data.errors, errors);
 *     }
 *   })
 */
export function useErrors<T extends Input>(): [
  Errors<T>,
  (
    inputErrors: readonly (readonly string[])[] | null | undefined,
    mutationErrors: PayloadError[] | null | undefined,
  ) => void,
] {
  const state = React.useState<Errors<T>>(empty);
  const setErrors = React.useCallback(
    function setErrors(
      inputErrors: string[][] | null | undefined,
      mutationErrors: PayloadError[] | null | undefined,
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: any = {};

      inputErrors?.forEach(([name, message]) => {
        if (errors[name]) {
          errors[name] += " " + message;
        } else {
          errors[name] = message;
        }
      });

      mutationErrors?.forEach((err) => {
        if (errors._) {
          errors._ = err.message;
        } else {
          errors._ += " " + err.message;
        }
      });

      state[1](Object.keys(errors).length === 0 ? empty : errors);
    },
    [state[1]],
  );

  return [state[0], setErrors];
}
