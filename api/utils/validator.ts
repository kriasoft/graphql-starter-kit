/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Represents a user input validation error that may contain several validation
 * errors per input field.
 */

import { Validator } from "validator-fluent";
import { reservedUsernames } from "./usernames";
export { validate, ValidationError } from "validator-fluent";

/**
 * Extends the fluent validator API by adding custom validation rules.
 *
 * @example
 *   const [data, errors] = validate(input, (value) => ({
 *     username: value("name").notEmpty().isUsername(),
 *     email: value("email").notEmpty().isEmail(),
 *     phone: value("phone").isMobilePhone({ locale: "en-US" }),
 *   }));
 *
 * @see https://github.com/validatorjs/validator.js/
 * @see https://github.com/kriasoft/validator-fluent
 */
declare module "validator-fluent" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class Validator<K, V> {
    /**
     * Checks if the input string satisfies the username requirements.
     */
    isUsername(): this;
  }
}

Validator.prototype.isUsername = function isUsername() {
  if (!this.isEmpty) {
    if (typeof this.value !== "string") {
      throw new Error("Must be a string.");
    }

    if (this.value.length < 2) {
      this.errors.push("Must be at least 2 characters long.");
    }

    if (this.value.length > 30) {
      this.errors.push("Can't be longer than 30 characters.");
    }

    if (!/^[0-9a-zA-Z._]+$/.test(this.value)) {
      this.errors.push(
        "Can contain letters (a-z), numbers (0-9), periods (.), and underscores (_).",
      );
    }

    if (this.value.startsWith(".")) {
      this.errors.push("Cannot start with a period.");
    }

    if (this.value.startsWith("_")) {
      this.errors.push("Cannot start with an underscore.");
    }

    if (this.value.endsWith(".")) {
      this.errors.push("Cannot end with a period.");
    }

    if (this.value.endsWith("_")) {
      this.errors.push("Cannot end with an underscore.");
    }

    if (/^\d/.test(this.value)) {
      this.errors.push("Cannot start with a number.");
    }

    if (/\..*\./.test(this.value)) {
      this.errors.push("Cannot contain more than one period (.).");
    }

    if (reservedUsernames.includes(this.value)) {
      this.errors.push("This username is not available.");
    }
  }

  return this;
};
