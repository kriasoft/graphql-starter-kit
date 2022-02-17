/**
 * @generated SignedSource<<2d54313240795035ec2265dce22778a2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Auth_user$data = {
  readonly id: string;
  readonly username: string;
  readonly email: string | null;
  readonly name: string | null;
  readonly picture: {
    readonly url: string | null;
  };
  readonly " $fragmentType": "Auth_user";
};
export type Auth_user$key = {
  readonly " $data"?: Auth_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Auth_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Auth_user",
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
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "c192be6d7199adc941cc2dce714bbc66";

export default node;
