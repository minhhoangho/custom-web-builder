import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export function useSetting() {
  return useContext(SettingsContext);
}
