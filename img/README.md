# Cloud Image Resizing

This cloud function is intended to be used for image resizing and optimization
needs as a light and cheaper alternative to 3rd party services.

```js
const { createHandler } = require("image-resizing");

/**
 * Dynamic image resizing. Usage example:
 *
 *   https://example.com/img/image.jpg - original image
 *   https://example.com/img/w_60,h_80/image.jpg - 60x80 thumbnail
 *
 * @see https://github.com/kriasoft/image-resizing
 */
module.exports.img = createHandler({
  // Where the source images are located.
  // E.g. gs://s.example.com/image.jpg
  sourceBucket: process.env.SOURCE_BUCKET,

  // Where the transformed images needs to be stored.
  // E.g. gs://c.example.com/image__w_80,h_60.jpg
  cacheBucket: process.env.CACHE_BUCKET,
});
```

## How to Deploy

Ensure that the source and cache GCS bucket exist, then run:

```
$ yarn img:deploy [--env #0]
```

## License

Copyright © 2016-present Kriasoft. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/kriasoft/graphql-starter/blob/main/LICENSE) file.
