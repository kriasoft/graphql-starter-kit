# GraphQL Schema

```js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { me } from './User';
import { node, nodes } from './Node';
import { stories, createStory, updateStory } from './Story';
import { createComment, updateComment } from './Comment';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      me,
      node,
      nodes,
      stories,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createStory,
      updateStory,
      createComment,
      updateComment,
    },
  }),
});
```

## The Top-level Fields and Mutations

* `Comment`
* `Node`
* `Story`
* `User`

## GraphQL Types

* `CommentType`
* `EmailType`
* `StoryType`
* `UserType`
