import { useCallback, useRef } from "react";
import { useTaskOperations } from "./useTaskOperations";
import { useBoard } from "../context/BoardContext";
import { TaskId, BoardState } from "../types/board";

type ColumnKey = keyof BoardState["order"];

export const useBoardDnD = (filteredOrder: Record<string, TaskId[]>) => {
  const { state } = useBoard();
  const { moveTask } = useTaskOperations();
  const dragInfo = useRef<{ taskId: TaskId; sourceColumn: ColumnKey; sourceIndex: number } | null>(
    null
  );

  const onDragStart = useCallback(
    (e: React.DragEvent, taskId: TaskId, sourceColumn: string, sourceIndex: number) => {
      dragInfo.current = { taskId, sourceColumn: sourceColumn as ColumnKey, sourceIndex };
      e.dataTransfer.setData("text/plain", taskId);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent, destinationColumn: ColumnKey, destinationIndex: number) => {
      e.preventDefault();
      if (!dragInfo.current) return;

      const { taskId, sourceColumn } = dragInfo.current;

      const masterSourceList = state.order[sourceColumn];
      const masterDestinationList = state.order[destinationColumn];

      // 1. Find the real source index
      const realSourceIndex = masterSourceList.indexOf(taskId);

      // 2. Find the real destination index
      let realDestinationIndex: number;
      const filteredDestList = filteredOrder[destinationColumn];

      if (destinationIndex >= filteredDestList.length) {
        realDestinationIndex = masterDestinationList.length;
      } else {
        const targetTaskId = filteredDestList[destinationIndex];
        realDestinationIndex = masterDestinationList.indexOf(targetTaskId);
      }

      moveTask(taskId, sourceColumn, destinationColumn, realSourceIndex, realDestinationIndex);
      dragInfo.current = null;
    },
    [state.order, filteredOrder, moveTask]
  );

  return {
    onDragStart,
    onDragOver,
    onDrop,
  };
};
