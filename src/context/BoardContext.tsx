import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { BoardState, BoardAction } from "../types/board";
import { boardReducer } from "../state/boardReducer";
import { initialState } from "../state/initialState";

interface BoardContextType {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
