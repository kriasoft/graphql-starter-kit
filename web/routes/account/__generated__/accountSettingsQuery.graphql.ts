/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type accountSettingsQueryVariables = {};
export type accountSettingsQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly name: string | null;
        readonly email: string | null;
        readonly username: string;
    } | null;
};
export type accountSettingsQuery = {
    readonly response: accountSettingsQueryResponse;
    readonly variables: accountSettingsQueryVariables;
};



/*
query accountSettingsQuery {
  me {
    id
    name
    email
    username
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
    "name": "accountSettingsQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "accountSettingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "dd2f665e96cc67a5257c4461b4a11764",
    "id": null,
    "metadata": {},
    "name": "accountSettingsQuery",
    "operationKind": "query",
    "text": "query accountSettingsQuery {\n  me {\n    id\n    name\n    email\n    username\n  }\n}\n"
  }
};
})();
(node as any).hash = '8d47cf8eaa4d0278fb78f335f1f5a9e9';
export default node;
