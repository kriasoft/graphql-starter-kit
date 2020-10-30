/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";

export type ResetRelayFn = () => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ResetRelayContext = React.createContext<ResetRelayFn>(() => {});
