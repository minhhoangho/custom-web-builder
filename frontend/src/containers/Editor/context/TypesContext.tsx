import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@components/common';
import { Action, ObjectType } from '@constants/editor';
import { useUndoRedo } from '../hooks';
import { EditorTypeInterface } from '../interfaces';

export const TypesContext = createContext<{
  types: EditorTypeInterface[];
  setTypes: React.Dispatch<React.SetStateAction<EditorTypeInterface[]>>;
  addType: (data: EditorTypeInterface, addToHistory?: boolean) => void;
  updateType: (id: number, values: Partial<EditorTypeInterface>) => void;
  deleteType: (id: number, addToHistory?: boolean) => void;
}>({
  types: [],
  setTypes: () => {},
  addType: () => {},
  updateType: () => {},
  deleteType: () => {},
});

export default function TypesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [types, setTypes] = useState<EditorTypeInterface[]>([]);
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addType = (data: EditorTypeInterface, addToHistory = true) => {
    if (data) {
      setTypes((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);
        return temp;
      });
    } else {
      setTypes((prev) => [
        ...prev,
        {
          name: `type_${prev.length}`,
          fields: [],
          comment: '',
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.ADD,
          element: ObjectType.TYPE,
          message: t('add_type'),
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteType = (id, addToHistory = true) => {
    if (addToHistory) {
      toast('success', t('type_deleted'));
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.TYPE,
          id: id,
          data: types[id],
          message: t('delete_type', {
            typeName: types[id].name,
          }),
        },
      ]);
      setRedoStack([]);
    }
    setTypes((prev) => prev.filter((e, i) => i !== id));
  };

  const updateType = (id, values) => {
    setTypes((prev) =>
      prev.map((e, i) => (i === id ? { ...e, ...values } : e)),
    );
  };

  return (
    <TypesContext.Provider
      value={{
        types,
        setTypes,
        addType,
        updateType,
        deleteType,
      }}
    >
      {children}
    </TypesContext.Provider>
  );
}
