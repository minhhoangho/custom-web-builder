import { useContext } from 'react';
import { CanvasContext } from '../context/CanvasContext';

export function useCanvas() {
  return useContext(CanvasContext);
}
