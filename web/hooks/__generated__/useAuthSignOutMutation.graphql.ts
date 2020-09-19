/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type useAuthSignOutMutationVariables = {};
export type useAuthSignOutMutationResponse = {
    readonly signOut: string | null;
};
export type useAuthSignOutMutation = {
    readonly response: useAuthSignOutMutationResponse;
    readonly variables: useAuthSignOutMutationVariables;
};



/*
mutation useAuthSignOutMutation {
  signOut
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "signOut",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "useAuthSignOutMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useAuthSignOutMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "d0fe6467f225a88550b46ffeb30f2b5b",
    "id": null,
    "metadata": {},
    "name": "useAuthSignOutMutation",
    "operationKind": "mutation",
    "text": "mutation useAuthSignOutMutation {\n  signOut\n}\n"
  }
};
})();
(node as any).hash = 'e64db0352baa482e2de3b17514fdd119';
export default node;
