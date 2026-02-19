import React from "react";
import {
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useTaskFilters } from "../../hooks/useTaskFilters";

export const Filters: React.FC = () => {
  const { filters, setFilterText, setFilterPriority } = useTaskFilters();

  const handlePriorityChange = (e: SelectChangeEvent<number | "">) => {
    const val = e.target.value;
    setFilterPriority(val === "" ? null : (val as number));
  };

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
        <Select<number | "">
          value={filters.priority === null ? "" : filters.priority}
          label="Priority"
          onChange={handlePriorityChange}
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
