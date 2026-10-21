

import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useLeaveGuard = (shouldGuard, onBlock) => {
  useEffect(() => {
    if (!shouldGuard) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();

      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldGuard]);

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) => {

        return shouldGuard && currentLocation.pathname !== nextLocation.pathname;
      },
      [shouldGuard]
    )
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      onBlock(
        () => blocker.proceed(),
        () => blocker.reset()
      );
    }
  }, [blocker, onBlock]);
};
