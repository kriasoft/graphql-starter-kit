/**
 * @generated SignedSource<<348a6efa9907cbab209df3ee8695eab8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AuthSignOutMutation$variables = {};
export type AuthSignOutMutation$data = {
  readonly signOut: string | null;
};
export type AuthSignOutMutation = {
  variables: AuthSignOutMutation$variables;
  response: AuthSignOutMutation$data;
};

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
    "name": "AuthSignOutMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AuthSignOutMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "1fb7f38e73bb858152a432e232f15710",
    "id": null,
    "metadata": {},
    "name": "AuthSignOutMutation",
    "operationKind": "mutation",
    "text": "mutation AuthSignOutMutation {\n  signOut\n}\n"
  }
};
})();

(node as any).hash = "54c6f623d9cb508fff497e2c5f7841e3";

export default node;
