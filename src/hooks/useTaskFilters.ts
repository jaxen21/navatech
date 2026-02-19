import { useMemo } from "react";
import { useBoard } from "../context/BoardContext";
import { TaskId, BoardActionType, Priority } from "../types/board";

export const useTaskFilters = () => {
  const { state, dispatch } = useBoard();

  const filters = state.filters;

  const setFilterText = (text: string) => {
    dispatch({ type: BoardActionType.SET_FILTER_TEXT, payload: { text } });
  };

  const setFilterPriority = (priority: number | null) => {
    dispatch({
      type: BoardActionType.SET_FILTER_PRIORITY,
      payload: { priority: priority as Priority | null },
    });
  };

  const filteredOrder = useMemo(() => {
    const { text, priority } = filters;
    const result: Record<string, TaskId[]> = {
      todo: [],
      inProgress: [],
      done: [],
    };

    (Object.keys(state.order) as Array<keyof typeof state.order>).forEach((column) => {
      result[column] = state.order[column].filter((taskId) => {
        const task = state.tasks[taskId];
        if (!task) return false;

        const matchesText =
          task.title.toLowerCase().includes(text.toLowerCase()) ||
          task.description.toLowerCase().includes(text.toLowerCase());
        const matchesPriority = priority === null || task.priority === priority;

        return matchesText && matchesPriority;
      });
    });

    return result;
  }, [state, filters]);

  return {
    filters,
    setFilterText,
    setFilterPriority,
    filteredOrder,
  };
};
