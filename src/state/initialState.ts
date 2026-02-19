import { BoardState } from "../types/board";

export const initialState: BoardState = {
  tasks: {},
  order: {
    todo: [],
    inProgress: [],
    done: [],
  },
  filters: {
    text: "",
    priority: null,
  },
  history: [],
  future: [],
};
