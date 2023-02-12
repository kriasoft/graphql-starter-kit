/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { GraphQLEnumType } from "graphql";

export const UploadTypeType = new GraphQLEnumType({
  name: "UploadType",
  description: "The type of the uploaded file",
  values: {
    ProfilePicture: { value: "profile-picture" },
    ClassCoverImage: { value: "class-cover-image" },
    ClassVideoImage: { value: "class-video-image" },
  },
});
