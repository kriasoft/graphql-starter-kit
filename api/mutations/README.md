# GraphQL Mutations

Please, prefer creating UPSERT mutations in instead of CREATE + UPDATE whenever possible, this reduces unnecessary code duplication. For example:

```js
import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLID, GraphQLString } from "graphql";

import { db } from "../core";
import { StoryType } from "../types";
import { fromGlobalId } from "../utils";

export const upsertStory = mutationWithClientMutationId({
  name: "UpsertStory",
  description: "Creates or updates a story.",

  inputFields: {
    id: { type: GraphQLID },
    text: { type: GraphQLString },
  },

  outputFields: {
    story: { type: StoryType },
  },

  async mutateAndGetPayload({ id, ...data }, ctx) {
    ctx.ensureAuthorized();

    let story;

    if (id) {
      // Updates an existing story by ID
      [story] = await db
        .table("stories")
        .where({ id: fromGlobalId(id, "Story") })
        .update(data)
        .returning("*");
    } else {
      // Otherwise, creates a new story
      [story] = await db.table("stories").insert(data).returning("*");
    }

    return { story };
  },
});
```

Don't forget to check permissions using `ctx.ensureAuthorized()` helper method
from `src/server/context.js`. For example:

```js
const story = await db.table("stories").where({ id }).first();

ctx.ensureAuthorized((user) => story.author_id === user.id);
```

Always validate user and sanitize user input! We use [`validator.js`](https://github.com/validatorjs/validator.js) + a custom helper function `validate(input, validator => /* rules */)` for that. For example:

```js
const { data, errors } = await validate(input, (x) =>
  x
    .field("title", { trim: true })
    .isRequired()
    .isLength({ min: 5, max: 80 })

    .field("text", { alias: "URL or text", trim: true })
    .isRequired()
    .isLength({ min: 10, max: 1000 }),
);

if (errors.length > 0) {
  return { errors };
}

await db.table("stories").where({ id }).update(data);
```
