/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css } from "@emotion/react";

export type TextFieldProps = {
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  fullWidth?: boolean;
  error?: string;
};

export function TextField(props: TextFieldProps): JSX.Element {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;
        width: 100%;
      `}
    >
      <label
        css={css`
          font-size: 0.825rem;
          margin-bottom: 2px;
        `}
        htmlFor={props.name}
        children={props.label}
      />
      <input
        css={css`
          padding: 5px;
          margin-bottom: 4px;
        `}
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      />
      {props.error && (
        <span
          css={css`
            font-size: 0.75rem;
            color: red;
            margin-bottom: 4px;
          `}
        >
          {props.error}
        </span>
      )}
    </div>
  );
}
