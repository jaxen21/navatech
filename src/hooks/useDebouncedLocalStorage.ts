import { useEffect, useRef } from "react";
import { BoardState } from "../types/board";
import { initialState } from "../state/initialState";

const STORAGE_KEY = "fluxboard_state";

export const useDebouncedLocalStorage = (
  state: BoardState,
  hydrationAction: (hydratedState: Omit<BoardState, "history" | "future">) => void
) => {
  const isFirstRender = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.tasks && parsed.order) {
          hydrationAction(parsed);
        } else {
          throw new Error("Invalid state structure");
        }
      }
    } catch (error) {
      console.error("Failed to hydrate state from localStorage:", error);
      localStorage.removeItem(STORAGE_KEY);
      hydrationAction(initialState);
    }
  }, [hydrationAction]); // Fixed dependency

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
        const { tasks, order } = state;
        const stateToPersist = { tasks, order };
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
  }, [state]); // Fixed dependency to satisfy lint
};
