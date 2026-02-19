import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem("fluxboard_state");
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: "error.container",
                color: "error.onContainer",
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 64, mb: 2, color: "error.main" }} />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                The application encountered an unexpected error. This might be due to corrupted
                local data.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button variant="outlined" color="error" onClick={this.handleReset}>
                  Reset Board Data
                </Button>
              </Box>
              {process.env.NODE_ENV === "development" && (
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: "rgba(0,0,0,0.05)",
                    borderRadius: 2,
                    textAlign: "left",
                    overflowX: "auto",
                  }}
                >
                  <Typography variant="caption" component="pre">
                    {this.state.error?.toString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
