import { useCallback } from "react";
import { useBoard } from "../context/BoardContext";

export const useUndoRedo = () => {
  const { state, dispatch } = useBoard();

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, [dispatch]);

  return {
    undo,
    redo,
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
  };
};
