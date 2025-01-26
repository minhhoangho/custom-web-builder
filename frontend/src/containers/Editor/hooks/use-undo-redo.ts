import { useContext } from 'react';
import { UndoRedoContext } from '../context/UndoRedoContext';

export function useUndoRedo() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useUndoRedo must be used within a UndoRedoProvider');
  }
  return context;
}
