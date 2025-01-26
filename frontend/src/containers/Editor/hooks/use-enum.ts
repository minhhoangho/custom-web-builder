import { useContext } from 'react';
import { EnumsContext } from '../context/EnumsContext';

export function useEnum() {
  const context = useContext(EnumsContext);
  if (!context) {
    throw new Error('useEnum must be used within a EnumProvider');
  }
  return context;
}
