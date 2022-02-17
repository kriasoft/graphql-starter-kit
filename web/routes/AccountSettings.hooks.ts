/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { graphql, useMutation } from "react-relay";
import { useAuth } from "../core";
import { type UpdateUserInput } from "../queries/AccountSettingsMutation.graphql";

const mutation = graphql`
  mutation AccountSettingsMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        ...Auth_user
      }
    }
  }
`;

type Input = UpdateUserInput;
type InputErrors = { [key in keyof Input | "_"]?: string[] };

function useState(): {
  input: Input;
  errors: InputErrors;
  loading: boolean;
  handleChange: React.ChangeEventHandler;
  handleSubmit: React.FormEventHandler;
} {
  const { me } = useAuth();
  const [commit, loading] = useMutation(mutation);
  const [errors, setErrors] = React.useState<InputErrors>({});
  const [input, setInput] = React.useState<Input>({
    id: me?.id || "",
    username: me?.username || "",
    email: me?.email || "",
    name: me?.name || "",
  });

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setInput((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      commit({
        variables: { input },
        onCompleted(res, errors) {
          const err = errors?.[0];
          if (err) {
            setErrors(err.errors || { _: [err.message] });
          } else {
            setErrors({});
          }
        },
      });
    },
    [input],
  );

  return React.useMemo(
    () => ({ input, errors, loading, handleChange, handleSubmit }),
    [input, errors, loading, handleChange, handleSubmit],
  );
}

export { useState, type Input, type InputErrors };
