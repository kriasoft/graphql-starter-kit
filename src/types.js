/* @flow */

export type ValidationErrorEntry = {
  key: string,
  message: string,
};

export type ValidationOutput = {
  data: any,
  errors: Array<ValidationErrorEntry>,
};
