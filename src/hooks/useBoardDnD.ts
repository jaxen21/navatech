import { useCallback, useRef } from "react";
import { useTaskOperations } from "./useTaskOperations";
import { useBoard } from "../context/BoardContext";
import { TaskId } from "../types/board";

export const useBoardDnD = (filteredOrder: Record<string, TaskId[]>) => {
  const { state } = useBoard();
  const { moveTask } = useTaskOperations();
  const dragInfo = useRef<{ taskId: TaskId; sourceColumn: string; sourceIndex: number } | null>(null);

  const onDragStart = useCallback((e: React.DragEvent, taskId: TaskId, sourceColumn: string, sourceIndex: number) => {
    dragInfo.current = { taskId, sourceColumn, sourceIndex };
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent, destinationColumn: string, destinationIndex: number) => {
    e.preventDefault();
    if (!dragInfo.current) return;

    const { taskId, sourceColumn, sourceIndex: filteredSourceIndex } = dragInfo.current;

    // Filter Awareness Logic:
    // We need to find the real indices in the master state.order list
    const masterSourceList = (state.order as any)[sourceColumn];
    const masterDestinationList = (state.order as any)[destinationColumn];

    // The index passed as argument is from the filtered list.
    // We need to map it to the master list.
    
    // 1. Find the real source index
    const realSourceIndex = masterSourceList.indexOf(taskId);

    // 2. Find the real destination index
    let realDestinationIndex: number;
    const filteredDestList = filteredOrder[destinationColumn];
    
    if (destinationIndex >= filteredDestList.length) {
      // Dropping at the end of the filtered list
      realDestinationIndex = masterDestinationList.length;
    } else {
      // Find the item currently at destinationIndex in the filtered list
      const targetTaskId = filteredDestList[destinationIndex];
      realDestinationIndex = masterDestinationList.indexOf(targetTaskId);
    }

    moveTask(taskId, sourceColumn as any, destinationColumn as any, realSourceIndex, realDestinationIndex);
    dragInfo.current = null;
  }, [state.order, filteredOrder, moveTask]);

  return {
    onDragStart,
    onDragOver,
    onDrop,
  };
};
