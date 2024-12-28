import { useContext } from 'react';
import { SaveStateContext } from '../context/SaveStateContext';

export function useSaveState() {
  return useContext(SaveStateContext);
}
