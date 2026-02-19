import { BoardAction, BoardState, TaskId } from "../types/board";

const MAX_HISTORY = 15;

const pushToHistory = (state: BoardState): BoardState => {
  const { history, future, ...currentStateWithoutHistory } = state;
  const newHistory = [currentStateWithoutHistory, ...history].slice(0, MAX_HISTORY);
  return {
    ...state,
    history: newHistory,
    future: [], // Clear future on new action
  };
};

export const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case "ADD_TASK": {
      const newState = pushToHistory(state);
      const { task } = action.payload;
      return {
        ...newState,
        tasks: {
          ...newState.tasks,
          [task.id]: task,
        },
        order: {
          ...newState.order,
          todo: [task.id, ...newState.order.todo],
        },
      };
    }

    case "UPDATE_TASK": {
      const newState = pushToHistory(state);
      const { id, updates } = action.payload;
      if (!newState.tasks[id]) return state;

      return {
        ...newState,
        tasks: {
          ...newState.tasks,
          [id]: {
            ...newState.tasks[id],
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case "DELETE_TASK": {
      const newState = pushToHistory(state);
      const { id } = action.payload;
      const { [id]: _, ...remainingTasks } = newState.tasks;

      return {
        ...newState,
        tasks: remainingTasks,
        order: {
          todo: newState.order.todo.filter((tid) => tid !== id),
          inProgress: newState.order.inProgress.filter((tid) => tid !== id),
          done: newState.order.done.filter((tid) => tid !== id),
        },
      };
    }

    case "MOVE_TASK": {
      const newState = pushToHistory(state);
      const { taskId, sourceColumn, destinationColumn, sourceIndex, destinationIndex } = action.payload;

      const newOrder = { ...newState.order };
      const sourceList = [...newOrder[sourceColumn]];
      const destList = sourceColumn === destinationColumn ? sourceList : [...newOrder[destinationColumn]];

      sourceList.splice(sourceIndex, 1);
      destList.splice(destinationIndex, 0, taskId);

      newOrder[sourceColumn] = sourceList;
      if (sourceColumn !== destinationColumn) {
        newOrder[destinationColumn] = destList;
      }

      // Update task status if it changed columns
      const updatedTasks = { ...newState.tasks };
      if (sourceColumn !== destinationColumn) {
        const newStatusMap: Record<string, "todo" | "inProgress" | "done"> = {
          todo: "todo",
          inProgress: "in-progress",
          done: "done",
        };
        updatedTasks[taskId] = {
          ...updatedTasks[taskId],
          status: newStatusMap[destinationColumn] as any,
          updatedAt: Date.now(),
        };
      }

      return {
        ...newState,
        tasks: updatedTasks,
        order: newOrder,
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;

      const [previousState, ...remainingHistory] = state.history;
      const { history, future, ...currentStateWithoutHistory } = state;

      return {
        ...previousState,
        history: remainingHistory,
        future: [currentStateWithoutHistory, ...state.future],
      } as BoardState;
    }

    case "REDO": {
      if (state.future.length === 0) return state;

      const [nextState, ...remainingFuture] = state.future;
      const { history, future, ...currentStateWithoutHistory } = state;

      return {
        ...nextState,
        history: [currentStateWithoutHistory, ...state.history],
        future: remainingFuture,
      } as BoardState;
    }

    case "HYDRATE": {
      return {
        ...state,
        ...action.payload.state,
        history: [],
        future: [],
      };
    }

    case "SET_FILTER_TEXT": {
      return {
        ...state,
        filters: {
          ...state.filters,
          text: action.payload.text,
        },
      };
    }

    case "SET_FILTER_PRIORITY": {
      return {
        ...state,
        filters: {
          ...state.filters,
          priority: action.payload.priority,
        },
      };
    }

    default:
      return state;
  }
};
