/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type userProfileQueryVariables = {
    username: string;
};
export type userProfileQueryResponse = {
    readonly user: {
        readonly id: string;
        readonly name: string | null;
        readonly email: string | null;
        readonly username: string;
        readonly picture: {
            readonly url: string | null;
        };
    } | null;
};
export type userProfileQuery = {
    readonly response: userProfileQueryResponse;
    readonly variables: userProfileQueryVariables;
};



/*
query userProfileQuery(
  $username: String!
) {
  user(username: $username) {
    id
    name
    email
    username
    picture {
      url
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "username"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "username",
        "variableName": "username"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
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
        "name": "name",
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
        "name": "username",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Picture",
        "kind": "LinkedField",
        "name": "picture",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "url",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "userProfileQuery",
    "selections": (v1/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "userProfileQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8e56c32d1475b9bc1d6934da447a0d74",
    "id": null,
    "metadata": {},
    "name": "userProfileQuery",
    "operationKind": "query",
    "text": "query userProfileQuery(\n  $username: String!\n) {\n  user(username: $username) {\n    id\n    name\n    email\n    username\n    picture {\n      url\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '86ea7b9247a97190d358a2c6fccba861';
export default node;
