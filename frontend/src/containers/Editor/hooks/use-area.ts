import { useContext } from 'react';
import { AreasContext } from '../context/AreasContext';

export function useArea() {
  const context = useContext(AreasContext);
  if (!context) {
    throw new Error('useArea must be used within a AreaProvider');
  }
  return context;
}
