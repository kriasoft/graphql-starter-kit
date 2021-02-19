/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css } from "@emotion/react";
import { graphql, useMutation } from "react-relay/hooks";

import { useErrors } from "../../hooks";
import { TextField } from "../../common";
import type { settingsQueryResponse as Props } from "./__generated__/settingsQuery.graphql";
import type { SettingsUpdateMutation } from "./__generated__/SettingsUpdateMutation.graphql";

const updateUserMutation = graphql`
  mutation SettingsUpdateMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        email
      }
      errors
    }
  }
`;

export default function Settings(props: Props): JSX.Element {
  const { me } = props;
  const [input, setInput] = React.useState({
    id: me?.id || "",
    name: me?.name || "",
    email: me?.email || "",
  });

  const [updateUser] = useMutation<SettingsUpdateMutation>(updateUserMutation);
  const [error, setErrors] = useErrors();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((x) => ({ ...x, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!me) return;
    updateUser({
      variables: { input },
      onCompleted({ updateUser: data }, errors) {
        setErrors(data?.errors, errors);
      },
    });
  }

  return (
    <React.Fragment>
      <h1>Account Settings</h1>
      <form
        onSubmit={handleSubmit}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}
      >
        <TextField
          name="name"
          type="text"
          label="Name"
          value={input.name}
          error={error.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="email"
          type="email"
          label="Email"
          value={input.email}
          error={error.email}
          onChange={handleChange}
          fullWidth
        />
        <button type="submit">Save</button>
      </form>
    </React.Fragment>
  );
}
