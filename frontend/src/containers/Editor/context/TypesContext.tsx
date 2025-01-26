import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@components/common';
import { Action, ObjectType } from '@constants/editor';
import { DType } from 'src/data/interface';
import { useUndoRedo } from '../hooks';
import { EditorUndoStackInterface } from '../interfaces/stack.interface';

export const TypesContext = createContext<{
  types: DType[];
  setTypes: React.Dispatch<React.SetStateAction<DType[]>>;
  addType: (data: Partial<DType> | null, addToHistory?: boolean) => void;
  updateType: (id: number, values: Partial<DType>) => void;
  deleteType: (id: number, addToHistory?: boolean) => void;
} | null>(null);

export default function TypesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [types, setTypes] = useState<DType[]>([]);
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addType = (data: Partial<DType> | null, addToHistory = true) => {
    if (data) {
      setTypes((prev) => {
        const temp = prev.slice();
        temp.splice(data.id ?? 0, 0, data); // TODO: need check
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
      setUndoStack((prev: Partial<EditorUndoStackInterface>[]) => [
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

  const deleteType = (id: number, addToHistory = true) => {
    if (addToHistory) {
      toast('success', t('type_deleted'));
      setUndoStack((prev: Partial<EditorUndoStackInterface>[]) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.TYPE,
          id: id,
          data: types[id],
          message: `Type ${types[id]?.name} deleted`,
        },
      ]);
      setRedoStack([]);
    }
    setTypes((prev: DType[]) => prev.filter((_e: DType, i) => i !== id));
  };

  const updateType = (id: number, values: Partial<DType>) => {
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
