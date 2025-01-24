import React, { createContext, useState } from 'react';
import {
  EditorRedoStackInterface,
  EditorUndoStackInterface,
} from '../interfaces/stack.interface';

export const UndoRedoContext = createContext<{
  undoStack: EditorUndoStackInterface[];
  setUndoStack: React.Dispatch<
    React.SetStateAction<Partial<EditorUndoStackInterface>[]>
  >;
  redoStack: EditorRedoStackInterface[];
  setRedoStack: React.Dispatch<
    React.SetStateAction<Partial<EditorRedoStackInterface>[]>
  >;
}>({
  undoStack: [],
  setUndoStack: () => {},
  redoStack: [],
  setRedoStack: () => {},
});

export default function UndoRedoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [undoStack, setUndoStack] = useState<EditorUndoStackInterface[]>([]);
  const [redoStack, setRedoStack] = useState<EditorRedoStackInterface[]>([]);

  return (
    <UndoRedoContext.Provider
      value={{ undoStack, redoStack, setUndoStack, setRedoStack }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
}
