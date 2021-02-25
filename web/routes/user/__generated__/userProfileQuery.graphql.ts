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
        readonly picture: string | null;
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
    picture
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
        "kind": "ScalarField",
        "name": "picture",
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
    "cacheID": "799022dd46e8090e5dd52a5aba23ce35",
    "id": null,
    "metadata": {},
    "name": "userProfileQuery",
    "operationKind": "query",
    "text": "query userProfileQuery(\n  $username: String!\n) {\n  user(username: $username) {\n    id\n    name\n    email\n    username\n    picture\n  }\n}\n"
  }
};
})();
(node as any).hash = '07a99a6b2a7d0db8cec7f43783d6c725';
export default node;
