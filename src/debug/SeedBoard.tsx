import React, { useState, useEffect } from "react";
import { BoardState, Priority, Task, TaskStatus } from "../types/board";

export const generateStressTestData = (
  count: number = 5000
): Omit<BoardState, "history" | "future"> => {
  const tasks: Record<string, Task> = {};
  const order: Record<string, string[]> = {
    todo: [],
    inProgress: [],
    done: [],
  };

  const statuses: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  const priorities: Priority[] = [1, 2, 3];

  for (let i = 0; i < count; i++) {
    const id = `stress-${i}`;
    const status = statuses[i % 3];
    const priority = priorities[i % 3];

    tasks[id] = {
      id,
      title: `Stress Task ${i}`,
      description: `Description for stress task ${i}. Testing performance with large datasets.`,
      status,
      priority,
      createdAt: Date.now() - Math.random() * 10000000,
      updatedAt: Date.now(),
    };

    if (status === TaskStatus.TODO) order.todo.push(id);
    else if (status === TaskStatus.IN_PROGRESS) order.inProgress.push(id);
    else order.done.push(id);
  }

  return {
    tasks,
    order: order as BoardState["order"],
    filters: { text: "", priority: null },
  };
};

export const SeedBoard: React.FC<{
  onSeed: (state: Omit<BoardState, "history" | "future">) => void;
}> = ({ onSeed }) => {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem("fluxboard_debug_visible") === "true";
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + Alt + S using code for cross-layout reliability
      if (e.shiftKey && e.altKey && e.code === "KeyS") {
        setIsVisible((v) => {
          const next = !v;
          localStorage.setItem("fluxboard_debug_visible", String(next));
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => onSeed(generateStressTestData())}
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 9999,
        background: "#6750A4",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "12px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      Seed 5k Tasks
    </button>
  );
};
