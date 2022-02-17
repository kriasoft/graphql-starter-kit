/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

let timeZone: string;

function getTimeZone(): string | null {
  if (!timeZone) {
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  return timeZone;
}

export { getTimeZone };
