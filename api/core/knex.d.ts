/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import "knex";

declare module "knex" {
  namespace Knex {
    interface FunctionHelper {
      newUserId: (unique?: boolean) => Promise<string>;
    }
  }
}
