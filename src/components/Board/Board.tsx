import React, { useState } from "react";
import { Grid, Typography, Button, Box, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { Filters } from "../Filters/Filters";
import { TaskModal } from "../TaskModal/TaskModal";
import { useTaskFilters } from "../../hooks/useTaskFilters";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useBoardDnD } from "../../hooks/useBoardDnD";
import { Task } from "../../types/board";
import { Column } from "../Column/Column";

export const Board: React.FC = () => {
  const { filteredOrder } = useTaskFilters();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { onDragOver, onDrop } = useBoardDnD(filteredOrder);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          FluxBoard
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={undo} disabled={!canUndo} startIcon={<UndoIcon />}>
            Undo
          </Button>
          <Button variant="outlined" onClick={redo} disabled={!canRedo} startIcon={<RedoIcon />}>
            Redo
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            sx={{ ml: 2 }}
          >
            Add Task
          </Button>
        </Stack>
      </Stack>

      <Filters />

      <Grid container spacing={3} sx={{ mt: 2 }} component="div">
        <Grid size={{ xs: 12, md: 4 }} component="div">
          <Column
            title="To Do"
            status="todo"
            taskIds={filteredOrder.todo}
            onDragOver={onDragOver}
            onDrop={(e: React.DragEvent) => onDrop(e, "todo", filteredOrder.todo.length)}
            onEditTask={handleEditTask}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} component="div">
          <Column
            title="In Progress"
            status="inProgress"
            taskIds={filteredOrder.inProgress}
            onDragOver={onDragOver}
            onDrop={(e: React.DragEvent) =>
              onDrop(e, "inProgress", filteredOrder.inProgress.length)
            }
            onEditTask={handleEditTask}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} component="div">
          <Column
            title="Done"
            status="done"
            taskIds={filteredOrder.done}
            onDragOver={onDragOver}
            onDrop={(e: React.DragEvent) => onDrop(e, "done", filteredOrder.done.length)}
            onEditTask={handleEditTask}
          />
        </Grid>
      </Grid>

      <TaskModal open={modalOpen} onClose={handleCloseModal} task={editingTask} />
    </Box>
  );
};
