export type TaskId = string;

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export type Priority = 1 | 2 | 3; // 1: Low, 2: Medium, 3: High

export interface Task {
  id: TaskId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: number;
  updatedAt: number;
}

export interface BoardState {
  tasks: Record<TaskId, Task>;
  order: {
    todo: TaskId[];
    inProgress: TaskId[];
    done: TaskId[];
  };
  filters: {
    text: string;
    priority: Priority | null;
  };
  history: Omit<BoardState, "history" | "future">[];
  future: Omit<BoardState, "history" | "future">[];
}

export enum BoardActionType {
  ADD_TASK = "ADD_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  DELETE_TASK = "DELETE_TASK",
  MOVE_TASK = "MOVE_TASK",
  UNDO = "UNDO",
  REDO = "REDO",
  HYDRATE = "HYDRATE",
  SET_FILTER_TEXT = "SET_FILTER_TEXT",
  SET_FILTER_PRIORITY = "SET_FILTER_PRIORITY",
}

export type BoardAction =
  | { type: BoardActionType.ADD_TASK; payload: { task: Task } }
  | { type: BoardActionType.UPDATE_TASK; payload: { id: TaskId; updates: Partial<Task> } }
  | { type: BoardActionType.DELETE_TASK; payload: { id: TaskId } }
  | {
      type: BoardActionType.MOVE_TASK;
      payload: {
        taskId: TaskId;
        sourceColumn: keyof BoardState["order"];
        destinationColumn: keyof BoardState["order"];
        sourceIndex: number;
        destinationIndex: number;
      };
    }
  | { type: BoardActionType.UNDO }
  | { type: BoardActionType.REDO }
  | { type: BoardActionType.HYDRATE; payload: { state: Omit<BoardState, "history" | "future"> } }
  | { type: BoardActionType.SET_FILTER_TEXT; payload: { text: string } }
  | { type: BoardActionType.SET_FILTER_PRIORITY; payload: { priority: Priority | null } };
