/**
 * @generated SignedSource<<fbbf8c2d8363e295ec7c32df24e807df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateUserInput = {
  id: string;
  username?: string | null;
  email?: string | null;
  name?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  timeZone?: string | null;
  locale?: string | null;
};
export type SettingsMutation$variables = {
  input: UpdateUserInput;
};
export type SettingsMutationVariables = SettingsMutation$variables;
export type SettingsMutation$data = {
  readonly updateUser: {
    readonly user: {
      readonly " $fragmentSpreads": FragmentRefs<"Auth_user">;
    } | null;
  } | null;
};
export type SettingsMutationResponse = SettingsMutation$data;
export type SettingsMutation = {
  variables: SettingsMutationVariables;
  response: SettingsMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateUserPayload",
        "kind": "LinkedField",
        "name": "updateUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Auth_user"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateUserPayload",
        "kind": "LinkedField",
        "name": "updateUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "969248a277b4feb124bf5c2f5956edb6",
    "id": null,
    "metadata": {},
    "name": "SettingsMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    user {\n      ...Auth_user\n      id\n    }\n  }\n}\n\nfragment Auth_user on User {\n  id\n  username\n  email\n  name\n  picture {\n    url\n  }\n}\n"
  }
};
})();

(node as any).hash = "730eb224ecbdde76f3f21a6a226b47a3";

export default node;
