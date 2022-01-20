/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { createHandler } from "image-resizing";

/**
 * Dynamic image resizing. Usage example:
 *
 *   https://example.com/img/image.jpg - original image
 *   https://example.com/img/w_60,h_80/image.jpg - 60x80 thumbnail
 *
 * @see https://github.com/kriasoft/image-resizing
 */
export const img = createHandler({
  // Where the source images are located.
  // E.g. gs://s.example.com/image.jpg
  sourceBucket: String(process.env.SOURCE_BUCKET),

  // Where the transformed images will be stored.
  // E.g. gs://c.example.com/image__w_80,h_60.jpg
  cacheBucket: String(process.env.CACHE_BUCKET),
});
