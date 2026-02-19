import React from "react";
import { Box, Container } from "@mui/material";
import { useBoard } from "./context/BoardContext";
import { useDebouncedLocalStorage } from "./hooks/useDebouncedLocalStorage";
import { BoardActionType } from "./types/board";
import { SeedBoard } from "./debug/SeedBoard";
import { Board } from "./components/Board/Board";

const App: React.FC = () => {
  const { state, dispatch } = useBoard();

  // Handle persistence
  const handleHydrate = React.useCallback(
    (hydratedState: Omit<typeof state, "history" | "future">) => {
      dispatch({ type: BoardActionType.HYDRATE, payload: { state: hydratedState } });
    },
    [dispatch]
  );

  useDebouncedLocalStorage(state, handleHydrate);

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
      <SeedBoard
        onSeed={(state) => dispatch({ type: BoardActionType.HYDRATE, payload: { state } })}
      />
    </Box>
  );
};

export default App;
