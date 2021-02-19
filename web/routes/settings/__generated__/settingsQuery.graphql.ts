/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type settingsQueryVariables = {};
export type settingsQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly name: string | null;
        readonly email: string | null;
    } | null;
};
export type settingsQuery = {
    readonly response: settingsQueryResponse;
    readonly variables: settingsQueryVariables;
};



/*
query settingsQuery {
  me {
    id
    name
    email
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
    "name": "settingsQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "settingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "e9d9abb02ee9b6cf2b20143fb5020629",
    "id": null,
    "metadata": {},
    "name": "settingsQuery",
    "operationKind": "query",
    "text": "query settingsQuery {\n  me {\n    id\n    name\n    email\n  }\n}\n"
  }
};
})();
(node as any).hash = '399e16b7d691d7da85ca0451473fe2e6';
export default node;
