import { Context, createContext, useEffect, useState } from 'react';
import { tableWidth } from '@constants/editor';
import { EditorSettingsInterface } from '../interfaces';

const DEFAULT_SETTINGS: EditorSettingsInterface = {
  strictMode: false,
  showFieldSummary: true,
  showGrid: true,
  mode: 'light',
  autosave: true,
  panning: true,
  showCardinality: true,
  tableWidth: tableWidth,
  showDebugCoordinates: false,
};


export const SettingsContext = createContext<{
  settings: EditorSettingsInterface;
  setSettings: (settings: EditorSettingsInterface) => void;
}>({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {
  },
})

export default function SettingsContextProvider({ children }) {
  const [settings, setSettings] =
    useState<EditorSettingsInterface>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings) as EditorSettingsInterface);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
