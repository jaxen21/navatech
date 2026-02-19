import React from "react";
import { Stack, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useTaskFilters } from "../../hooks/useTaskFilters";

export const Filters: React.FC = () => {
  const { filters, setFilterText, setFilterPriority } = useTaskFilters();

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="Search tasks..."
        variant="outlined"
        value={filters.text}
        onChange={(e) => setFilterText(e.target.value)}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filters.priority === null ? "" : filters.priority}
          label="Priority"
          onChange={(e) => setFilterPriority(e.target.value === "" ? null : Number(e.target.value))}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={1}>Low</MenuItem>
          <MenuItem value={2}>Medium</MenuItem>
          <MenuItem value={3}>High</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};
