import { createContext, useState } from 'react';
import { State } from '@constants/editor';


export const SaveStateContext = createContext<{
  saveState: typeof State[keyof typeof State];
  setSaveState: (state: typeof State[keyof typeof State]) => void;
}>({
  saveState: State.NONE,
  setSaveState: () => {
  },
});

export default function SaveStateContextProvider({ children }) {
  const [saveState, setSaveState] = useState<typeof State[keyof typeof State]>(State.NONE);

  return (
    <SaveStateContext.Provider value={{ saveState, setSaveState }}>
      {children}
    </SaveStateContext.Provider>
  );
}
