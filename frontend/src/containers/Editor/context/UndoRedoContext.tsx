import React, { createContext, useState } from 'react';
import {
  EditorRedoStackInterface,
  EditorUndoStackInterface,
} from '../interfaces/stack.interface';

export const UndoRedoContext = createContext({
  undoStack: [],
  setUndoStack: React.Dispatch<
    React.SetStateAction<EditorUndoStackInterface[]>
  >,
  redoStack: [],
  setRedoStack: React.Dispatch<
    React.SetStateAction<EditorRedoStackInterface[]>
  >,
});

export default function UndoRedoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
