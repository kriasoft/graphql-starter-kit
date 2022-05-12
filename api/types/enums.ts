/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLEnumType } from "graphql";
import { mapValues } from "lodash";
import { IdentityProvider } from "../core";

export const IdentityProviderType = new GraphQLEnumType({
  name: "IdentityProvider",
  description: "OAuth identity provider",
  values: mapValues(IdentityProvider, (value) => ({ value })),
});

export const UploadTypeType = new GraphQLEnumType({
  name: "UploadType",
  description: "The type of the uploaded file",
  values: {
    ProfilePicture: { value: "profile-picture" },
    ClassCoverImage: { value: "class-cover-image" },
    ClassVideoImage: { value: "class-video-image" },
  },
});
