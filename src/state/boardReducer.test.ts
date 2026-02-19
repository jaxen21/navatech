import { boardReducer } from "./boardReducer";
import { initialState } from "./initialState";
import { Task, TaskStatus, BoardAction, BoardActionType } from "../types/board";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  status: TaskStatus.TODO,
  priority: 1,
  createdAt: 123,
  updatedAt: 123,
};

describe("boardReducer", () => {
  it("should handle ADD_TASK", () => {
    const action: BoardAction = { type: BoardActionType.ADD_TASK, payload: { task: mockTask } };
    const state = boardReducer(initialState, action);

    expect(state.tasks["1"]).toEqual(mockTask);
    expect(state.order.todo).toContain("1");
    expect(state.history.length).toBe(1);
    expect(state.history[0].tasks).toEqual({});
  });

  it("should handle UPDATE_TASK", () => {
    const startState = boardReducer(initialState, {
      type: BoardActionType.ADD_TASK,
      payload: { task: mockTask },
    });
    const action: BoardAction = {
      type: BoardActionType.UPDATE_TASK,
      payload: { id: "1", updates: { title: "Updated Title" } },
    };
    const state = boardReducer(startState, action);

    expect(state.tasks["1"].title).toBe("Updated Title");
    expect(state.history.length).toBe(2);
  });

  it("should handle DELETE_TASK", () => {
    const startState = boardReducer(initialState, {
      type: BoardActionType.ADD_TASK,
      payload: { task: mockTask },
    });
    const action: BoardAction = { type: BoardActionType.DELETE_TASK, payload: { id: "1" } };
    const state = boardReducer(startState, action);

    expect(state.tasks["1"]).toBeUndefined();
    expect(state.order.todo).not.toContain("1");
    expect(state.history.length).toBe(2);
  });

  it("should handle MOVE_TASK (intra-column)", () => {
    const task2 = { ...mockTask, id: "2" };
    let state = boardReducer(initialState, {
      type: BoardActionType.ADD_TASK,
      payload: { task: mockTask },
    });
    state = boardReducer(state, { type: BoardActionType.ADD_TASK, payload: { task: task2 } });

    // Initial order: [2, 1] (since ADD_TASK prepends)
    const action: BoardAction = {
      type: BoardActionType.MOVE_TASK,
      payload: {
        taskId: "2",
        sourceColumn: "todo",
        destinationColumn: "todo",
        sourceIndex: 0,
        destinationIndex: 1,
      },
    };
    state = boardReducer(state, action);

    expect(state.order.todo).toEqual(["1", "2"]);
  });

  it("should handle MOVE_TASK (inter-column)", () => {
    let state = boardReducer(initialState, {
      type: BoardActionType.ADD_TASK,
      payload: { task: mockTask },
    });

    const action: BoardAction = {
      type: BoardActionType.MOVE_TASK,
      payload: {
        taskId: "1",
        sourceColumn: "todo",
        destinationColumn: "inProgress",
        sourceIndex: 0,
        destinationIndex: 0,
      },
    };
    state = boardReducer(state, action);

    expect(state.order.todo).toEqual([]);
    expect(state.order.inProgress).toEqual(["1"]);
    expect(state.tasks["1"].status).toBe(TaskStatus.IN_PROGRESS);
  });

  it("should handle UNDO and REDO", () => {
    let state = boardReducer(initialState, {
      type: BoardActionType.ADD_TASK,
      payload: { task: mockTask },
    });
    expect(state.order.todo).toContain("1");

    state = boardReducer(state, { type: BoardActionType.UNDO });
    expect(state.order.todo).not.toContain("1");
    expect(state.future.length).toBe(1);

    state = boardReducer(state, { type: BoardActionType.REDO });
    expect(state.order.todo).toContain("1");
    expect(state.future.length).toBe(0);
  });

  it("should cap history at MAX_HISTORY", () => {
    let state = initialState;
    for (let i = 0; i < 20; i++) {
      state = boardReducer(state, {
        type: BoardActionType.ADD_TASK,
        payload: { task: { ...mockTask, id: `${i}` } },
      });
    }
    expect(state.history.length).toBe(15);
  });
});
