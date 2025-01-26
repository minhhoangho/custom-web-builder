import { useContext } from 'react';
import { DiagramContext } from '../context/DiagramContext';

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagram must be used within a DiagramProvider');
  }
  return context;
}
