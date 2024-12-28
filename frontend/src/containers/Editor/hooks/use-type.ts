import { useContext } from 'react';
import { TypesContext } from '../context/TypesContext';

export function useType() {
  return useContext(TypesContext);
}
