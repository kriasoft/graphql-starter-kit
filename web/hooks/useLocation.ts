/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { Location, LocationContext } from "../core/history";

export function useLocation(): Location {
  return React.useContext(LocationContext);
}
