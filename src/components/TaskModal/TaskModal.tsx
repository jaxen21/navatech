import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Task, Priority } from "../../types/board";
import { useTaskOperations } from "../../hooks/useTaskOperations";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task; // If provided, we are editing
}

export const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, task }) => {
  const { addTask, updateTask } = useTaskOperations();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(1);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    } else {
      setTitle("");
      setDescription("");
      setPriority(1);
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (task) {
      updateTask(task.id, { title, description, priority });
    } else {
      addTask(title, description, priority);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(Number(e.target.value) as Priority)}
            >
              <MenuItem value={1}>Low</MenuItem>
              <MenuItem value={2}>Medium</MenuItem>
              <MenuItem value={3}>High</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!title.trim()}>
          {task ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
