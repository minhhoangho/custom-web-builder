import React, { createContext, useState } from 'react';
import { ObjectType, Tab } from '@constants/editor';
import { EditorSelectInterface } from '../interfaces';

export const SelectContext = createContext<{
  selectedElement: EditorSelectInterface;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<EditorSelectInterface>
  >;
} | null>(null);

export default function SelectContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedElement, setSelectedElement] = useState<EditorSelectInterface>(
    {
      element: ObjectType.NONE,
      id: -1,
      openDialogue: false,
      openCollapse: false,
      currentTab: Tab.TABLES,
      open: false,
      openFromToolbar: false,
    },
  );

  return (
    <SelectContext.Provider value={{ selectedElement, setSelectedElement }}>
      {children}
    </SelectContext.Provider>
  );
}
