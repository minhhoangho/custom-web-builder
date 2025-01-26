import { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';

export function useNote() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNote must be used within a NoteProvider');
  }
  return context;
}
