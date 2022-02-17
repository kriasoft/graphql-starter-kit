/**
 * @generated SignedSource<<e96d350c3be167325c3543ec0b55289c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UploadType = "ProfilePicture" | "ClassCoverImage" | "ClassVideoImage" | "%future added value";
export type UploadSaveMutation$variables = {
  id: string;
  uploadURL: string;
  uploadType: UploadType;
};
export type UploadSaveMutation$data = {
  readonly saveUpload: {
    readonly user: {
      readonly id: string;
      readonly picture: {
        readonly url: string | null;
      };
    } | null;
  } | null;
};
export type UploadSaveMutation = {
  variables: UploadSaveMutation$variables;
  response: UploadSaveMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "uploadType"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "uploadURL"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "uploadType",
        "variableName": "uploadType"
      },
      {
        "kind": "Variable",
        "name": "uploadURL",
        "variableName": "uploadURL"
      }
    ],
    "concreteType": "SaveUploadPayload",
    "kind": "LinkedField",
    "name": "saveUpload",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UploadSaveMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "UploadSaveMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "e94175439102c87ba923c96754459ba2",
    "id": null,
    "metadata": {},
    "name": "UploadSaveMutation",
    "operationKind": "mutation",
    "text": "mutation UploadSaveMutation(\n  $id: ID!\n  $uploadURL: String!\n  $uploadType: UploadType!\n) {\n  saveUpload(id: $id, uploadURL: $uploadURL, uploadType: $uploadType) {\n    user {\n      id\n      picture {\n        url\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c3fe880a4c49ada85c43a97648cdff3a";

export default node;
