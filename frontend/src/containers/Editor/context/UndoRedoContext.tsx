import { createContext, useState } from 'react';

export const UndoRedoContext = createContext({
  undoStack: [],
  setUndoStack: (data: any[] | Function) => {},
  redoStack: [],
  setRedoStack: (data: any[]) => {},
});

export default function UndoRedoContextProvider({ children }) {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  return (
    <UndoRedoContext.Provider
      value={{ undoStack, redoStack, setUndoStack, setRedoStack }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
}
