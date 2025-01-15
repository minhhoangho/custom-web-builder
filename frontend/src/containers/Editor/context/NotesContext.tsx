import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@components/common';
import { Action, defaultNoteTheme, ObjectType } from '@constants/editor';
import { useSelect, useTransform, useUndoRedo } from '../hooks';
import { EditorNoteInterface } from '../interfaces';

export const NotesContext = createContext<{
  notes: EditorNoteInterface[];
  setNotes: React.Dispatch<React.SetStateAction<EditorNoteInterface[]>>;
  updateNote: (id: number, values: EditorNoteInterface) => void;
  addNote: (
    data?: Partial<EditorNoteInterface> | null,
    addToHistory?: boolean,
  ) => void;
  deleteNote: (id: number, addToHistory?: boolean) => void;
}>({
  notes: [],
  setNotes: () => {},
  updateNote: () => {},
  addNote: () => {},
  deleteNote: () => {},
});

export default function NotesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<EditorNoteInterface[]>([]);
  const { transform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();

  const addNote = (
    data?: Partial<EditorNoteInterface> | null,
    addToHistory = true,
  ) => {
    if (data) {
      setNotes((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);
        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else {
      const height = 88;
      setNotes((prev) => [
        ...prev,
        {
          id: prev.length,
          x: transform.pan.x,
          y: transform.pan.y - height / 2,
          title: `note_${prev.length}`,
          content: '',
          color: defaultNoteTheme,
          height,
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.ADD,
          element: ObjectType.NOTE,
          message: t('add_note'),
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteNote = (id: number, addToHistory = true) => {
    if (addToHistory) {
      toast('success', t('note_deleted'));
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.NOTE,
          data: notes[id],
          message: `Deleted note: ${notes[id]?.title}`,
        },
      ]);
      setRedoStack([]);
    }
    setNotes((prev) =>
      prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i })),
    );
    if (id === selectedElement.id) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.NONE,
        id: -1,
        open: false,
      }));
    }
  };

  const updateNote = (id: number, values: Partial<EditorNoteInterface>) => {
    setNotes((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ...values,
          };
        }
        return t;
      }),
    );
  };

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, updateNote, addNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}
