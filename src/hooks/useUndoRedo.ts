import { useCallback } from "react";
import { useBoard } from "../context/BoardContext";
import { BoardActionType } from "../types/board";

export const useUndoRedo = () => {
  const { state, dispatch } = useBoard();

  const undo = useCallback(() => {
    dispatch({ type: BoardActionType.UNDO });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: BoardActionType.REDO });
  }, [dispatch]);

  return {
    undo,
    redo,
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
  };
};
