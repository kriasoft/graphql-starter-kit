/**
 * Custom application errors.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

export class UnauthorizedError extends Error {
  readonly code = 401;

  constructor(message = "Anonymous access is denied.") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends Error {
  readonly code = 403;

  constructor(message = "Access is denied.") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
