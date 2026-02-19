import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { TaskId, Task } from "../../types/board";
import { TaskCard } from "../TaskCard/TaskCard";

interface ColumnProps {
  title: string;
  status: string;
  taskIds: TaskId[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEditTask: (task: Task) => void;
}

export const Column: React.FC<ColumnProps> = ({ title, status, taskIds, onDragOver, onDrop, onEditTask }) => {
  return (
    <Paper
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, taskIds.length)}
      sx={{
        p: 2,
        minHeight: "70vh",
        bgcolor: "#F3EDF7", // M3 Surface Container
        borderRadius: 3,
        border: "1px solid #CAC4D0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            bgcolor: "primary.primaryContainer",
            color: "primary.onPrimaryContainer",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: "bold",
          }}
        >
          {taskIds.length}
        </Typography>
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          {taskIds.map((taskId, index) => (
            <TaskCard
              key={taskId}
              taskId={taskId}
              index={index}
              columnId={status}
              onEdit={() => {
                // We'll get the task from state in TaskCard
              }}
              onEditTask={onEditTask}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};
