/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { graphql, useMutation } from "react-relay";
import { UploadMutation } from "../queries/UploadMutation.graphql";
import {
  UploadSaveMutation,
  UploadType,
} from "../queries/UploadSaveMutation.graphql";

const uploadMutation = graphql`
  mutation UploadMutation($fileName: String!, $contentType: String) {
    uploadURL: getUploadURL(fileName: $fileName, contentType: $contentType)
  }
`;

const saveMutation = graphql`
  mutation UploadSaveMutation(
    $id: ID!
    $uploadURL: String!
    $uploadType: UploadType!
  ) {
    saveUpload(id: $id, uploadURL: $uploadURL, uploadType: $uploadType) {
      user {
        id
        picture {
          url
        }
      }
    }
  }
`;

type Options = {
  accept?: string;
  multiple?: boolean;
  saveAs?: {
    id?: string;
    type: UploadType;
  };
};

type FileInput = {
  file: File;
  url?: string;
  complete: boolean;
  error?: string;
};

function useUpload<Opt extends Options>(
  options: Opt,
): Opt["multiple"] extends true
  ? [JSX.Element, FileInput[] | undefined]
  : [JSX.Element, FileInput | undefined] {
  const { accept, multiple, saveAs } = options ?? {};

  const [getUploadURL] = useMutation<UploadMutation>(uploadMutation);
  const [save] = useMutation<UploadSaveMutation>(saveMutation);

  const [key, setKey] = React.useState(Date.now());
  const [files, setFiles] = React.useState<FileInput[]>();

  const setFile = React.useCallback(
    (index: number, cb: (input: FileInput) => FileInput) => {
      setFiles((prev) => prev?.map((x, i) => (i === index ? cb(x) : x)));
    },
    [],
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files && Array.from(event.target.files);
      setFiles(
        files?.map((file) => ({
          file,
          url: undefined,
          complete: false,
          error: undefined,
        })),
      );

      for (const [i, file] of files?.entries() || []) {
        getUploadURL({
          variables: { fileName: file.name, contentType: file.type },
          onCompleted({ uploadURL }, errors) {
            if (uploadURL) {
              setFile(i, (x) => ({ ...x, url: uploadURL }));
              fetch(uploadURL, { method: "PUT", body: file })
                .then(() => {
                  if (saveAs) {
                    save({
                      variables: {
                        id: saveAs.id as string,
                        uploadURL,
                        uploadType: saveAs.type,
                      },
                      onCompleted(res, errors) {
                        const err = errors?.[0];
                        if (err) {
                          setFile(i, (x) => ({
                            ...x,
                            complete: true,
                            error: err.message,
                          }));
                        } else {
                          setFile(i, (x) => ({ ...x, complete: true }));
                        }
                      },
                    });
                  } else {
                    setFile(i, (x) => ({ ...x, complete: true }));
                  }
                })
                .catch((err) =>
                  setFile(i, (x) => ({ ...x, error: err.message })),
                )
                .finally(() => setKey(Date.now()));
            } else {
              const error =
                errors?.[0]?.message || "Failed to get an upload URL.";
              setFile(i, (x) => ({ ...x, error }));
            }
          },
        });
      }
    },
    [saveAs?.id, saveAs?.type],
  );

  const fileInput = React.useMemo(
    () => (
      <input
        key={key}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        type="file"
        hidden
      />
    ),
    [key, accept, multiple, handleChange],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [fileInput, (multiple ? files : files?.[0]) as any];
}

export { useUpload };
