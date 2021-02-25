/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { css } from "@emotion/react";
import { graphql, useMutation } from "react-relay/hooks";
import { Button, TextField, Typography } from "@material-ui/core";

import { useErrors } from "../../hooks";
import type { accountSettingsQueryResponse as Props } from "./__generated__/accountSettingsQuery.graphql";
import type { SettingsUpdateMutation } from "./__generated__/SettingsUpdateMutation.graphql";

const updateUserMutation = graphql`
  mutation SettingsUpdateMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        email
        username
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
    username: me?.username || "",
  });

  const [updateUser] = useMutation<SettingsUpdateMutation>(updateUserMutation);
  const [error, setErrors] = useErrors();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((x) => ({ ...x, [name]: value }));
  }

  const fields: { key: keyof typeof input; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "username", label: "Username" },
  ];

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
      <Typography
        sx={{ marginBottom: (theme) => theme.spacing(2) }}
        variant="h2"
      >
        Account Settings
      </Typography>
      <form
        onSubmit={handleSubmit}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}
      >
        {fields.map((x) => (
          <TextField
            sx={{ marginBottom: (theme) => theme.spacing(2) }}
            key={x.key}
            name={x.key}
            type={x.key === "email" ? "email" : "text"}
            label={x.label}
            value={input[x.key]}
            placeholder={error[x.key]}
            onChange={handleChange}
            fullWidth
          />
        ))}

        <Button variant="contained" type="submit">
          Save
        </Button>
      </form>
    </React.Fragment>
  );
}
