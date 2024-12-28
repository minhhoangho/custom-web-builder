import { useContext } from 'react';
import { EnumsContext } from '../context/EnumsContext';

export function useEnum() {
  return useContext(EnumsContext);
}
