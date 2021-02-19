/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type homeQueryVariables = {};
export type homeQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly name: string | null;
        readonly email: string | null;
    } | null;
};
export type homeQuery = {
    readonly response: homeQueryResponse;
    readonly variables: homeQueryVariables;
};



/*
query homeQuery {
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
    "name": "homeQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "homeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7ca079b74393ca3b6317cadb93d17b79",
    "id": null,
    "metadata": {},
    "name": "homeQuery",
    "operationKind": "query",
    "text": "query homeQuery {\n  me {\n    id\n    name\n    email\n  }\n}\n"
  }
};
})();
(node as any).hash = 'a390731a23627dac4dca7ee3134c11cc';
export default node;
