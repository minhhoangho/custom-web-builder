import { useContext } from 'react';
import { SelectContext } from '../context/SelectContext';

export function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('useSelect must be used within a SelectProvider');
  }
  return context;
}
