/**
 * @generated SignedSource<<30f23c8994d6535d0a69eb3146b90e26>>
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
export type Auth_me = Auth_me$data;
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
