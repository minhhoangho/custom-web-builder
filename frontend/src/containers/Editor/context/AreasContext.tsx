import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@components/common';
import { Action, defaultBlue, ObjectType } from '@constants/editor';
import { useSelect, useTransform, useUndoRedo } from '../hooks';
import { EditorAreaInterface } from '../interfaces';

export const AreasContext = createContext<{
  areas: EditorAreaInterface[];
  setAreas: React.Dispatch<React.SetStateAction<EditorAreaInterface[]>>;
  updateArea: (id: number, values: Partial<EditorAreaInterface>) => void;
  addArea: (
    data?: Partial<EditorAreaInterface> | null,
    addToHistory?: boolean,
  ) => void;
  deleteArea: (id: number, addToHistory?: boolean) => void;
}>({
  areas: [],
  setAreas: () => {},
  updateArea: () => {},
  addArea: () => {},
  deleteArea: () => {},
});

export default function AreasContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [areas, setAreas] = useState<EditorAreaInterface[]>([]);
  const { transform } = useTransform();
  const { selectedElement, setSelectedElement } = useSelect();
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addArea = (
    data?: Partial<EditorAreaInterface> | null,
    addToHistory: boolean = true,
  ) => {
    if (data) {
      setAreas((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);
        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else {
      const width = 200;
      const height = 200;
      setAreas((prev) => [
        ...prev,
        {
          id: prev.length,
          name: `area_${prev.length}`,
          x: transform.pan.x - width / 2,
          y: transform.pan.y - height / 2,
          width,
          height,
          color: defaultBlue,
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.ADD,
          element: ObjectType.AREA,
          message: t('add_area'),
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteArea = (id, addToHistory = true) => {
    if (addToHistory) {
      toast('success', 'Deleted area');
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.AREA,
          data: areas[id],
          message: `Deleted area ${areas[id]?.name}`,
        },
      ]);
      setRedoStack([]);
    }
    setAreas((prev) =>
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

  const updateArea = (id: number, values: Partial<EditorAreaInterface>) => {
    setAreas((prev) =>
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
    <AreasContext.Provider
      value={{ areas, setAreas, updateArea, addArea, deleteArea }}
    >
      {children}
    </AreasContext.Provider>
  );
}
