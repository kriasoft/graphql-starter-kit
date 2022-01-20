/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

export class NotFoundError extends Error {
  status = 404;

  constructor(message = "Page not found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ForbiddenError extends Error {
  status = 403;

  constructor(message = "Access denied.") {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
