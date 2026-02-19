import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import App from './App';
import { theme } from './theme/theme';
import { BoardProvider } from './context/BoardContext';

test('renders fluxboard title', () => {
  render(
    <ThemeProvider theme={theme}>
      <BoardProvider>
        <App />
      </BoardProvider>
    </ThemeProvider>
  );
  const titleElement = screen.getByText(/FluxBoard/i);
  expect(titleElement).toBeInTheDocument();
});
