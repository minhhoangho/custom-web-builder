import { useContext } from 'react';
import { LayoutContext } from '../context/LayoutContext';

export function useLayout() {
  return useContext(LayoutContext);
}
