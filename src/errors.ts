/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

// TODO: Log the error to Google Stackdriver, Rollbar etc.
function report(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

export type ValidationErrorEntry = {
  key: string,
  message: string,
};

export class ValidationError extends Error {
  readonly code = 400;
  state: { [key: string]: string[] };

  constructor(errors: Array<ValidationErrorEntry>) {
    super('The request is invalid.');
    this.state = errors.reduce((result: { [key: string]: string[] }, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message);
      } else {
        Object.defineProperty(result, error.key, {
          value: [error.message],
          enumerable: true,
        });
      }
      return result;
    }, {});
  }
}

export class UnauthorizedError extends Error {
  readonly code = 401;

  constructor(message = 'Anonymous access is denied.') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends Error {
  readonly code = 403;

  constructor(message = 'Access is denied.') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default { report };
