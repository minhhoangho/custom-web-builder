import { useContext } from 'react';
import { UndoRedoContext } from '../context/UndoRedoContext';

export function useUndoRedo() {
  return useContext(UndoRedoContext);
}
