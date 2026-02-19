import { useMemo } from "react";
import { useBoard } from "../context/BoardContext";
import { TaskId, BoardActionType } from "../types/board";

export const useTaskFilters = () => {
  const { state, dispatch } = useBoard();
  const { tasks, order, filters } = state;

  const filteredOrder = useMemo(() => {
    const filterFn = (id: TaskId) => {
      const task = tasks[id];
      if (!task) return false;

      const matchesText = task.title.toLowerCase().includes(filters.text.toLowerCase()) ||
                        task.description.toLowerCase().includes(filters.text.toLowerCase());
      
      const matchesPriority = filters.priority === null || task.priority === filters.priority;

      return matchesText && matchesPriority;
    };

    return {
      todo: order.todo.filter(filterFn),
      inProgress: order.inProgress.filter(filterFn),
      done: order.done.filter(filterFn),
    };
  }, [tasks, order, filters]);

  const setFilterText = (text: string) => {
    dispatch({ type: BoardActionType.SET_FILTER_TEXT, payload: { text } });
  };

  const setFilterPriority = (priority: number | null) => {
    dispatch({ type: BoardActionType.SET_FILTER_PRIORITY, payload: { priority: priority as any } });
  };

  return {
    filteredOrder,
    filters,
    setFilterText,
    setFilterPriority,
  };
};
