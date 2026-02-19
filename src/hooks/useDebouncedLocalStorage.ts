import { useEffect, useRef } from "react";
import { BoardState } from "../types/board";
import { initialState } from "../state/initialState";

const STORAGE_KEY = "fluxboard_state";

export const useDebouncedLocalStorage = (state: BoardState, hydrationAction: (hydratedState: any) => void) => {
  const isFirstRender = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic validation: check if it has 'tasks' and 'order'
        if (parsed && typeof parsed === "object" && parsed.tasks && parsed.order) {
          hydrationAction(parsed);
        } else {
          throw new Error("Invalid state structure");
        }
      }
    } catch (error) {
      console.error("Failed to hydrate state from localStorage:", error);
      // Reset to initial state on error (Repair cycle)
      localStorage.removeItem(STORAGE_KEY);
      hydrationAction(initialState);
    }
  }, []); // Only on mount

  // Persist on state change (except filters)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const { history, future, filters, ...stateToPersist } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
      } catch (error) {
        console.error("Failed to persist state to localStorage:", error);
      }
    }, 800);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.tasks, state.order]); // Only watch data structures, not filters or history
};
