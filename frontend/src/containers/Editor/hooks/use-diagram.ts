import { useContext } from 'react';
import { DiagramContext } from '../context/DiagramContext';

export function useDiagram() {
  return useContext(DiagramContext);
}
