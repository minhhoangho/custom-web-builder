import { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';

export function useNote() {
  return useContext(NotesContext);
}
