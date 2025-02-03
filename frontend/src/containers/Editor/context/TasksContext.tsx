import React, { createContext, useState } from 'react';
import { EditorTaskInterface } from '../interfaces/task.interface';

export const TasksContext = createContext<{
  tasks: EditorTaskInterface[];
  setTasks: React.Dispatch<React.SetStateAction<EditorTaskInterface[]>>;
  updateTask: (id: number, values: Partial<EditorTaskInterface>) => void;
} | null>(null);

export default function TasksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<EditorTaskInterface[]>([]);

  const updateTask = (id: number, values: Partial<EditorTaskInterface>) =>
    setTasks((prev) =>
      prev.map((task, i) => (id === i ? { ...task, ...values } : task)),
    );

  return (
    <TasksContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}
