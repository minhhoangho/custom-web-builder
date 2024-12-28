import { useContext } from 'react';
import { AreasContext } from '../context/AreasContext';

export function useArea() {
  return useContext(AreasContext);
}
