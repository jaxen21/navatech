import React, { memo } from "react";
import { Card, CardContent, Typography, Box, Chip, Stack, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { TaskId, Priority, Task } from "../../types/board";
import { useBoard } from "../../context/BoardContext";
import { useBoardDnD } from "../../hooks/useBoardDnD";
import { useLiveTimer, formatTimeAgo } from "../../hooks/useLiveTimer";
import { useTaskFilters } from "../../hooks/useTaskFilters";
import { useTaskOperations } from "../../hooks/useTaskOperations";

interface TaskCardProps {
  taskId: TaskId;
  index: number;
  columnId: string;
  onEditTask: (task: Task) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 3: return "error";
    case 2: return "warning";
    case 1: return "success";
    default: return "default";
  }
};

const getPriorityLabel = (priority: Priority) => {
  switch (priority) {
    case 3: return "High";
    case 2: return "Medium";
    case 1: return "Low";
    default: return "None";
  }
};

export const TaskCard = memo(({ taskId, index, columnId, onEditTask }: TaskCardProps) => {
  const { state } = useBoard();
  const { deleteTask } = useTaskOperations();
  const { filteredOrder } = useTaskFilters();
  const task = state.tasks[taskId];
  const now = useLiveTimer(10000); // Update every 10s
  const { onDragStart } = useBoardDnD(filteredOrder);

  if (!task) return null;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, taskId, columnId, index)}
      sx={{
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        position: "relative",
        "&:hover .action-buttons": { opacity: 1 },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack spacing={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body1" fontWeight="bold" noWrap sx={{ maxWidth: "70%" }}>
              {task.title}
            </Typography>
            <Chip
              label={getPriorityLabel(task.priority)}
              color={getPriorityColor(task.priority)}
              size="small"
              variant="filled"
              sx={{ height: 20, fontSize: "0.65rem" }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: 40
          }}>
            {task.description}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
              <Typography variant="caption" color="text.disabled">
                {formatTimeAgo(task.updatedAt, now)}
              </Typography>
            </Box>

            <Box className="action-buttons" sx={{ opacity: 0, transition: "opacity 0.2s" }}>
              <IconButton size="small" onClick={() => onEditTask(task)}>
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => deleteTask(taskId)}>
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.taskId === nextProps.taskId && 
         prevProps.index === nextProps.index && 
         prevProps.columnId === nextProps.columnId;
});
