import { createContext, useState } from 'react';
import { ObjectType, Tab } from '@constants/editor';
import { EditorSelectInterface } from "../interfaces";

export const SelectContext = createContext<{
  selectedElement: EditorSelectInterface;
  setSelectedElement: (element: EditorSelectInterface) => void;
} | null>(null);

export default function SelectContextProvider({ children }) {
  const [selectedElement, setSelectedElement] = useState<EditorSelectInterface>({
    element: ObjectType.NONE,
    id: -1,
    openDialogue: false,
    openCollapse: false,
    currentTab: Tab.TABLES,
    open: false, // open popover or sidesheet when sidebar is disabled
    openFromToolbar: false, // this is to handle triggering onClickOutside when sidebar is disabled
  });

  return (
    <SelectContext.Provider value={{ selectedElement, setSelectedElement }}>
      {children}
    </SelectContext.Provider>
  );
}
