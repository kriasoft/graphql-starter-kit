/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import "knex";

declare module "knex" {
  namespace Knex {
    interface FunctionHelper {
      newUserId: (unique?: boolean) => Promise<string>;
      newTeamId: (unique?: boolean) => Promise<string>;
      newClassId: (unique?: boolean) => Promise<string>;
      newSessionId: (unique?: boolean) => Promise<string>;
      newPostId: (unique?: boolean) => Promise<string>;
      newCommentId: (unique?: boolean) => Promise<string>;
    }
  }
}
