/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { History, HistoryContext } from "../core/history";

export function useHistory(): History {
  return React.useContext(HistoryContext);
}
