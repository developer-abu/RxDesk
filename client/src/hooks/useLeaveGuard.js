/**
 * useLeaveGuard.js
 *
 * Prevents accidental loss of an in-progress prescription.
 *
 * Two layers of protection per spec §12.2:
 *  1. Browser native: beforeunload event → browser shows its own dialog
 *     (covers refresh, tab close, URL bar navigation)
 *  2. In-app: intercepts React Router navigation and opens a custom
 *     confirmation dialog (covers header links, Back button within the app)
 *
 * The guard is ONLY active when the prescription has content.
 * Selecting a chamber alone does NOT trigger the guard.
 */

import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

/**
 * @param {boolean} shouldGuard  — true when form has patient/clinical content
 * @param {Function} onBlock     — called with (proceed, cancel) when in-app nav is blocked
 */
export const useLeaveGuard = (shouldGuard, onBlock) => {
  const onBlockRef = useRef(onBlock);
  onBlockRef.current = onBlock;

  /* --- 1. Browser native beforeunload (refresh / tab close) --- */
  useEffect(() => {
    if (!shouldGuard) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Modern browsers show a generic message; custom text is ignored
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldGuard]);

  /* --- 2. React Router in-app navigation blocker --- */
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) => {
        // Block if guard is active AND we're actually navigating away
        return shouldGuard && currentLocation.pathname !== nextLocation.pathname;
      },
      [shouldGuard]
    )
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      onBlockRef.current(
        () => blocker.proceed(),  // "Leave Page" button
        () => blocker.reset()     // "Stay on Page" button
      );
    }
  }, [blocker]);
}

