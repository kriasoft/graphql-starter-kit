/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LoginDialogMeQueryVariables = {};
export type LoginDialogMeQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly username: string;
        readonly email: string | null;
        readonly emailVerified: boolean | null;
        readonly name: string | null;
        readonly picture: string | null;
        readonly timeZone: string | null;
        readonly locale: string | null;
        readonly createdAt: string | null;
        readonly updatedAt: string | null;
        readonly lastLogin: string | null;
    } | null;
};
export type LoginDialogMeQuery = {
    readonly response: LoginDialogMeQueryResponse;
    readonly variables: LoginDialogMeQueryVariables;
};



/*
query LoginDialogMeQuery {
  me {
    id
    username
    email
    emailVerified
    name
    picture
    timeZone
    locale
    createdAt
    updatedAt
    lastLogin
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "username",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "emailVerified",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "picture",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "timeZone",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "locale",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastLogin",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginDialogMeQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LoginDialogMeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "93aea7e2f905940ec70271c7770ca8ac",
    "id": null,
    "metadata": {},
    "name": "LoginDialogMeQuery",
    "operationKind": "query",
    "text": "query LoginDialogMeQuery {\n  me {\n    id\n    username\n    email\n    emailVerified\n    name\n    picture\n    timeZone\n    locale\n    createdAt\n    updatedAt\n    lastLogin\n  }\n}\n"
  }
};
})();
(node as any).hash = 'a9a9590f07005af2be80953e4415d200';
export default node;
