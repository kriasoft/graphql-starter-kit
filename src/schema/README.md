# GraphQL Schema

This folder contains GraphQL type definitions (queries, mutations etc.) grouped
by the major business entities (user, product etc.). Below you can find a few
code samples demonstarting common patterns.


### `schema/index.js` - the top-level schema object

```js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import userQueries from './user/queries';
import storyQueries from './story/queries';
import storyMutations from './story/mutations';
import commentMutations from './comment/mutations';
import { nodeField, nodesField } from './node';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
      ...userQueries,
      ...storyQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...storyMutations,
      ...commentMutations,
    },
  }),
});
```

### `schema/user/UserType.js` - User type

```js
import { GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import EmailType from './EmailType';
import { nodeInterface } from '../node';
import type Context from '../../Context';

export default new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    displayName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.display_name;
      },
    },

    emails: {
      type: new GraphQLList(EmailType),
      resolve(parent, args, ctx: Context) {
        return parent.id === ctx.user.id
          ? ctx.emailsByUserId.load(parent.id)
          : null;
      },
    },
  },
});
```

### `schema/user/queries.js` - User related query fields

```js
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../db';
import UserType from './UserType';
import type Context from '../../Context';

const me = {
  type: UserType,
  resolve(root: any, args: any, ctx: Context) {
    return ctx.user && ctx.userById.load(ctx.user.id);
  },
};

const users = {
  type: connectionDefinitions({
    name: 'User',
    nodeType: UserType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(root: any, args: any, ctx: Context) {
    /* TODO: Read data from the database */

    return {
      ...connectionFromArraySlice(data, args, {
        sliceStart: offset,
        arrayLength: totalCount,
      }),
      totalCount,
    };
  },
};

export default {
  me,
  users,
};
```

### `schema/user/mutations.js` - user related mutation fields

```js
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import db from '../../db';
import validate from './validate';
import UserType from './UserType';
import { ValidationError } from '../../errors';
import type Context from '../../Context';

const inputFields = {
  email: {
    type: GraphQLString,
  },
  password: {
    type: GraphQLString,
  },
};

const outputFields = {
  me: {
    type: UserType,
  },
};

export const sigup = mutationWithClientMutationId({
  name: 'Signup',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input: any, ctx: Context) {
    const { data, errors } = validate(input, ctx);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    /* TODP: Create a new user account */

    return { me: user };
  },
});

export default {
  signup,
};
```

### `schema/user/validate.js` - validation logic

```js
import validator from 'validator';

import db from '../../db';
import type Context from '../../Context';
import type { ValidationOutput } from '../../types';

export default function validate(input: any, ctx: Context): ValidationOutput {
  const errors = [];
  const data = {};
  const { t, user } = ctx;

  if (!input.email) {
    errors.push({
      key: 'email',
      message: t('The email address field cannot be empty.'),
    });
  } else {
    const user = db.table('users').where({ email }).first();
      if (user) {
        errors.push({
          key: 'email',
          message: t('A user with this email address already exists.'),
        });
      } else {
        data.email = email;
      }
    }
  }

  /* other validation rules */

  return { data, errors };
}
```
