import React, { createContext, useState } from 'react';
import {
  EditorRedoStackInterface,
  EditorUndoStackInterface,
} from '../interfaces/stack.interface';

export const UndoRedoContext = createContext<{
  undoStack: Partial<EditorUndoStackInterface>[];
  setUndoStack: React.Dispatch<
    React.SetStateAction<Partial<EditorUndoStackInterface>[]>
  >;
  redoStack: Partial<EditorRedoStackInterface>[];
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
  const [undoStack, setUndoStack] = useState<
    Partial<EditorUndoStackInterface>[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    Partial<EditorRedoStackInterface>[]
  >([]);

  return (
    <UndoRedoContext.Provider
      value={{ undoStack, redoStack, setUndoStack, setRedoStack }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
}
