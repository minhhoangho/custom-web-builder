import { useContext } from 'react';
import { TypesContext } from '../context/TypesContext';

export function useType() {
  const context = useContext(TypesContext);
  if (!context) {
    throw new Error('useType must be used within a TypeProvider');
  }
  return context;
}
