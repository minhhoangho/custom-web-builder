import React, { createContext, useState } from 'react';
import { EditorLayoutInterface } from '../interfaces';

export const LayoutContext = createContext<{
  layout: EditorLayoutInterface;
  setLayout: React.Dispatch<React.SetStateAction<EditorLayoutInterface>>;
}>({
  layout: {
    header: true,
    sidebar: true,
    issues: true,
    toolbar: true,
  },
  setLayout: () => {},
});

export default function LayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<EditorLayoutInterface>({
    header: true,
    sidebar: true,
    issues: true,
    toolbar: true,
  });

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}
