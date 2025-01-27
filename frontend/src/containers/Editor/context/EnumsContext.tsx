import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Action, ObjectType } from '@constants/editor';
import { toast } from '@components/common';
import { DEnum } from 'src/data/interface';
import { useUndoRedo } from '../hooks';

export const EnumsContext = createContext<{
  enums: DEnum[];
  setEnums: React.Dispatch<React.SetStateAction<DEnum[]>>;
  addEnum: (data: Partial<DEnum> | null, addToHistory?: boolean) => void;
  deleteEnum: (id: number, addToHistory?: boolean) => void;
  updateEnum: (id: number, values: DEnum) => void;
} | null>(null);

export default function EnumsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [enums, setEnums] = useState<DEnum[]>([]);
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const addEnum = (data: Partial<DEnum> | null, addToHistory = true) => {
    if (data) {
      setEnums((prev) => {
        const temp = prev.slice();
        if (!data.id) return temp;
        temp.splice(data.id, 0, data as DEnum);
        return temp;
      });
    } else {
      setEnums((prev) => [
        ...prev,
        {
          name: `enum_${prev.length}`,
          values: [],
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.ADD,
          element: ObjectType.ENUM,
          message: t('add_enum'),
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteEnum = (id: number, addToHistory = true) => {
    if (addToHistory) {
      toast('success', t('enum_deleted'));
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.ENUM,
          id: id,
          data: enums[id],
          message: `Deleted enum ${enums[id]?.name}`,
        },
      ]);
      setRedoStack([]);
    }
    setEnums((prev) => prev.filter((_, i) => i !== id));
  };

  const updateEnum = (
    id: number,
    values: Partial<{
      name: string;
      values: string[];
    }>,
  ) => {
    setEnums((prev) =>
      prev.map((e, i) => (i === id ? { ...e, ...values } : e)),
    );
  };

  return (
    <EnumsContext.Provider
      value={{
        enums,
        setEnums,
        addEnum,
        updateEnum,
        deleteEnum,
      }}
    >
      {children}
    </EnumsContext.Provider>
  );
}
