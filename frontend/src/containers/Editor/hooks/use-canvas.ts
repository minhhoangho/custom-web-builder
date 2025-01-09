import { useContext } from 'react';
import { CanvasContext } from 'src/containers/Editor/context/CanvasContext';

export function useCanvas() {
  return useContext(CanvasContext);
}
