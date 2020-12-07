/**
 * Exports a subset of validation functions from Validator.js library
 * that is intended to reduce the amount of boilerplate code in
 * GraphQL mutations while validating and sanitizing user input.
 *
 * @see https://github.com/validatorjs/validator.js
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import isURL from "validator/lib/isURL";
import textTrim from "validator/lib/trim";
import { fromGlobalId } from "graphql-relay";
import type { IsEmailOptions, IsLengthOptions, IsURLOptions } from "validator";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface FieldConfig<As, V> {
  /** Data key, defaults to input key. */
  as?: As;
  /** Field name, defaults to input key. */
  alias?: string;
  trim?: boolean | string;
  transform?: (value: V) => any;
  type?: string;
}

interface Status {
  valid: boolean;
  message?: string;
}

function isEmpty(value: string | null | undefined): boolean {
  return typeof value === "undefined" || value === null || value === "";
}

export class Validator<
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown> = {} // eslint-disable-line @typescript-eslint/ban-types
> {
  readonly data: Output = {};
  readonly errors: [/** key */ string, /** message */ string][] = [];

  private readonly input: Input;
  private validate: (cb: (value: any, field: string) => Status) => this = () =>
    this;

  constructor(input: Input) {
    this.input = input;
  }

  /**
   * Initializes a new field validator.
   */
  field<Key extends keyof Input, As extends string | undefined>(
    key: Key,
    config: FieldConfig<As, Input[Key]> = {},
  ): Validator<
    Input,
    Record<keyof Output | ([undefined] extends [As] ? Key : As), unknown>
  > {
    let value = this.input[key] as any;

    if (value && config.trim) {
      value = textTrim(value, config.trim === true ? undefined : config.trim);
    }

    if (value && config.transform) {
      value = config.transform(value);
    }

    if (value && config.type) {
      const globalId = fromGlobalId(value);

      if (globalId.type !== config.type) {
        throw new Error(
          `Expected an ID of type '${config.type}' but got '${globalId.type}'.`,
        );
      }

      value = globalId.id;
    }

    if (this.input[key] !== undefined) {
      this.data[config.as || key] = value;
    }

    this.validate = (cb: (value: any, field: string) => Status): this => {
      const { valid, message } = cb(value, (config.as || key) as string);

      if (!valid) {
        this.errors.push([key as string, message || "Invalid value."]);
      }

      return this;
    };

    return this;
  }

  isRequired = (message?: string): this =>
    this.validate((value, field) => ({
      valid: !isEmpty(value),
      message: message || `The ${field} field cannot be empty.`,
    }));

  isRequiredIf = (check: boolean, message?: string): this =>
    this.validate((value, field) => ({
      valid: check === true ? !isEmpty(value) : true,
      message: message || `The ${field} field cannot be empty.`,
    }));

  isEmail = (options?: IsEmailOptions, message?: string): this =>
    this.validate((value) => ({
      valid: value === undefined ? true : isEmail(value, options),
      message: message || "The email address is invalid.",
    }));

  isLength = (options?: IsLengthOptions, message?: string): this =>
    this.validate((value, field) => ({
      valid: value === undefined ? true : isLength(value, options),
      message: message
        ? message
        : options?.min && options?.max
        ? `The ${field} field must be between ${options.min} and ${options.max} characters long.`
        : options?.max
        ? `The ${field} field must be up to ${options.max} characters long.`
        : `Invalid length.`,
    }));

  isURL = (options?: IsURLOptions, message?: string): this =>
    this.validate((value) => ({
      valid: value === undefined ? true : isURL(value, options),
      message: message || "The URL is invalid.",
    }));

  is = (check: (value: any) => boolean, message?: string): this =>
    this.validate((value) => ({
      valid: value === undefined ? true : check(value),
      message,
    }));
}

export function validate<Input extends Record<string, unknown>, Validation>(
  input: Input,
  cb: (config: Validator<Input>) => Validation,
): Validation {
  return cb(new Validator(input));
}
