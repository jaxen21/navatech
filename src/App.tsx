import React from "react";
import { Box, Container } from "@mui/material";
import { Board } from "./components/Board/Board";
import { useBoard } from "./context/BoardContext";
import { useDebouncedLocalStorage } from "./hooks/useDebouncedLocalStorage";
import { BoardActionType } from "./types/board";

const App: React.FC = () => {
  const { state, dispatch } = useBoard();

  // Handle persistence
  useDebouncedLocalStorage(state, (hydratedState) => {
    dispatch({ type: BoardActionType.HYDRATE, payload: { state: hydratedState } });
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Board />
      </Container>
    </Box>
  );
};

export default App;
