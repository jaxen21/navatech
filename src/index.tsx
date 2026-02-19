import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import { theme } from "./theme/theme";
import { BoardProvider } from "./context/BoardContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BoardProvider>
        <App />
      </BoardProvider>
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
