/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UpdateUserInput = {
    id: string;
    username?: string | null;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
    timeZone?: string | null;
    locale?: string | null;
    admin?: boolean | null;
    validateOnly?: boolean | null;
    clientMutationId?: string | null;
};
export type SettingsUpdateMutationVariables = {
    input: UpdateUserInput;
};
export type SettingsUpdateMutationResponse = {
    readonly updateUser: {
        readonly user: {
            readonly id: string;
            readonly name: string | null;
            readonly email: string | null;
        } | null;
        readonly errors: ReadonlyArray<ReadonlyArray<string | null>> | null;
    } | null;
};
export type SettingsUpdateMutation = {
    readonly response: SettingsUpdateMutationResponse;
    readonly variables: SettingsUpdateMutationVariables;
};



/*
mutation SettingsUpdateMutation(
  $input: UpdateUserInput!
) {
  updateUser(input: $input) {
    user {
      id
      name
      email
    }
    errors
  }
}
*/

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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errors",
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
    "name": "SettingsUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cf283ad877ef002bc600210d66966754",
    "id": null,
    "metadata": {},
    "name": "SettingsUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsUpdateMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n    }\n    errors\n  }\n}\n"
  }
};
})();
(node as any).hash = '87e5035f55513040b34500b0a71e039e';
export default node;
