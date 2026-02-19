import { useCallback } from "react";
import { useBoard } from "../context/BoardContext";
import { Task, TaskId, Priority, TaskStatus } from "../types/board";

export const useTaskOperations = () => {
  const { dispatch } = useBoard();

  const addTask = useCallback(
    (title: string, description: string, priority: Priority) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        status: TaskStatus.TODO,
        priority,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      dispatch({ type: "ADD_TASK", payload: { task: newTask } });
    },
    [dispatch]
  );

  const updateTask = useCallback(
    (id: TaskId, updates: Partial<Task>) => {
      dispatch({ type: "UPDATE_TASK", payload: { id, updates } });
    },
    [dispatch]
  );

  const deleteTask = useCallback(
    (id: TaskId) => {
      dispatch({ type: "DELETE_TASK", payload: { id } });
    },
    [dispatch]
  );

  const moveTask = useCallback(
    (
      taskId: TaskId,
      sourceColumn: "todo" | "inProgress" | "done",
      destinationColumn: "todo" | "inProgress" | "done",
      sourceIndex: number,
      destinationIndex: number
    ) => {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          taskId,
          sourceColumn,
          destinationColumn,
          sourceIndex,
          destinationIndex,
        },
      });
    },
    [dispatch]
  );

  return {
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
};
