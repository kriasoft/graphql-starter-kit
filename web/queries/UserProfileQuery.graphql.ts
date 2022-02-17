/**
 * @generated SignedSource<<500269faff0f49098157e7f5bfad70d7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserProfileQuery$variables = {
  username: string;
};
export type UserProfileQuery$data = {
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
export type UserProfileQuery = {
  variables: UserProfileQuery$variables;
  response: UserProfileQuery$data;
};

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
    "name": "UserProfileQuery",
    "selections": (v1/*: any*/),
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserProfileQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f9bbe6698cd508940ed45fccc35de685",
    "id": null,
    "metadata": {},
    "name": "UserProfileQuery",
    "operationKind": "query",
    "text": "query UserProfileQuery(\n  $username: String!\n) {\n  user(username: $username) {\n    id\n    name\n    email\n    username\n    picture {\n      url\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a5ccee5ad3f62c9ab9cce575c77e3c66";

export default node;
