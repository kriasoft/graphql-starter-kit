/**
 * @generated SignedSource<<5736e024dda8c838de4f3716b024d969>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Auth_me$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"Auth_user">;
  } | null;
  readonly " $fragmentType": "Auth_me";
};
export type Auth_me$key = {
  readonly " $data"?: Auth_me$data;
  readonly " $fragmentSpreads": FragmentRefs<"Auth_me">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Auth_me",
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "Auth_user"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Root",
  "abstractKey": null
};

(node as any).hash = "cafc975065b3baf7ad8f1b18dcd09ef6";

export default node;
