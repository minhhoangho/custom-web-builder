import React, { createContext, useState } from 'react';
import { State } from '@constants/editor';

export const SaveStateContext = createContext(State.NONE);

export default function SaveStateContextProvider({ children }) {
  const [saveState, setSaveState] = useState<
    (typeof State)[keyof typeof State]
  >(State.NONE);

  return (
    <SaveStateContext.Provider value={{ saveState, setSaveState }}>
      {children}
    </SaveStateContext.Provider>
  );
}
