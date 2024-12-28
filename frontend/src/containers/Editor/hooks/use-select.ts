import { useContext } from 'react';
import { SelectContext } from '../context/SelectContext';

export function useSelect() {
  return useContext(SelectContext);
}
