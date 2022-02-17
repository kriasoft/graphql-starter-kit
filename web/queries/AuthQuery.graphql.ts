/**
 * @generated SignedSource<<4c2777ebe433e619550235816295c4af>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AuthQuery$variables = {};
export type AuthQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"Auth_me">;
};
export type AuthQuery = {
  variables: AuthQuery$variables;
  response: AuthQuery$data;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuthQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "Auth_me"
      }
    ],
    "type": "Root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AuthQuery",
    "selections": [
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
            "name": "name",
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
    ]
  },
  "params": {
    "cacheID": "26ea56e0f5de49dc5cb4ac93429f5c2f",
    "id": null,
    "metadata": {},
    "name": "AuthQuery",
    "operationKind": "query",
    "text": "query AuthQuery {\n  ...Auth_me\n}\n\nfragment Auth_me on Root {\n  me {\n    ...Auth_user\n    id\n  }\n}\n\nfragment Auth_user on User {\n  id\n  username\n  email\n  name\n  picture {\n    url\n  }\n}\n"
  }
};

(node as any).hash = "18d6a3ce572785476d30bb1c6a18d76a";

export default node;
