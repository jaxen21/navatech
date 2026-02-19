import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { TaskId, Task } from "../../types/board";
import { TaskCard } from "../TaskCard/TaskCard";
import { VirtualList } from "../VirtualList/VirtualList";

interface ColumnProps {
  title: string;
  status: string;
  taskIds: TaskId[];
  onDragStart: (
    e: React.DragEvent,
    taskId: TaskId,
    sourceColumn: string,
    sourceIndex: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEditTask: (task: Task) => void;
}

export const Column: React.FC<ColumnProps> = ({
  title,
  status,
  taskIds,
  onDragStart,
  onDragOver,
  onDrop,
  onEditTask,
}) => {
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

      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <VirtualList
          items={taskIds}
          itemHeight={160} // Estimated height + gap
          containerHeight="70vh"
          renderItem={(taskId, index) => (
            <Box
              key={taskId}
              sx={{ pb: 2 }}
              onDragOver={onDragOver}
              onDrop={(e) => {
                e.stopPropagation();
                onDrop(e, index);
              }}
            >
              <TaskCard
                taskId={taskId}
                index={index}
                columnId={status}
                onDragStart={onDragStart}
                onEditTask={onEditTask}
              />
            </Box>
          )}
        />
      </Box>
    </Paper>
  );
};
