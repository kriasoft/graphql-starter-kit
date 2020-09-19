/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type useCurrentUserQueryVariables = {};
export type useCurrentUserQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly name: string | null;
        readonly email: string | null;
        readonly picture: string | null;
    } | null;
};
export type useCurrentUserQuery = {
    readonly response: useCurrentUserQueryResponse;
    readonly variables: useCurrentUserQueryVariables;
};



/*
query useCurrentUserQuery {
  me {
    id
    name
    email
    picture
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
        "name": "picture",
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
    "name": "useCurrentUserQuery",
    "selections": (v0/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useCurrentUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "62dc10ffb5f9ead0f44ab1ec4ef5bec8",
    "id": null,
    "metadata": {},
    "name": "useCurrentUserQuery",
    "operationKind": "query",
    "text": "query useCurrentUserQuery {\n  me {\n    id\n    name\n    email\n    picture\n  }\n}\n"
  }
};
})();
(node as any).hash = '3ba91e34820c4e5ff040fd8596b89d15';
export default node;
