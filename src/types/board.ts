export type TaskId = string;

export type TaskStatus = "todo" | "in-progress" | "done";

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

export type BoardAction =
  | { type: "ADD_TASK"; payload: { task: Task } }
  | { type: "UPDATE_TASK"; payload: { id: TaskId; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: { id: TaskId } }
  | {
      type: "MOVE_TASK";
      payload: {
        taskId: TaskId;
        sourceColumn: keyof BoardState["order"];
        destinationColumn: keyof BoardState["order"];
        sourceIndex: number;
        destinationIndex: number;
      };
    }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "HYDRATE"; payload: { state: Omit<BoardState, "history" | "future"> } }
  | { type: "SET_FILTER_TEXT"; payload: { text: string } }
  | { type: "SET_FILTER_PRIORITY"; payload: { priority: Priority | null } };
