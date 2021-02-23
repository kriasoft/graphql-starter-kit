/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { To } from "history";
import { useHistory } from "./useHistory";

function isLeftClickEvent(event: React.MouseEvent<HTMLElement>) {
  return event.button === 0;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function useNavigate<T extends HTMLElement = HTMLAnchorElement>(): (
  event: React.MouseEvent<T>,
) => void {
  const history = useHistory();

  return React.useCallback(
    (event: React.MouseEvent<T>): void => {
      if (
        event.defaultPrevented ||
        isModifiedEvent(event) ||
        !isLeftClickEvent(event)
      ) {
        return;
      }

      event.preventDefault();
      history.push(event.currentTarget.getAttribute("href") as To);
    },
    [history],
  );
}
