/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLObjectType, GraphQLString } from "graphql";
import { Context } from "../core";
import env from "../env";

type Picture = {
  url?: string;
  filename?: string;
  version?: number;
  width?: number;
  height?: number;
};

export const PictureType = new GraphQLObjectType<Picture, Context>({
  name: "Picture",

  fields: {
    url: {
      type: GraphQLString,
      resolve(self) {
        if (self.filename) {
          return [
            `https://${env.STORAGE_BUCKET}/`,
            self.filename,
            self.version && `?v=${self.version}`,
          ]
            .filter(Boolean)
            .join("");
        } else {
          return self.url;
        }
      },
    },
  },
});
