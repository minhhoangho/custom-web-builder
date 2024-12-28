import { useContext } from 'react';
import { TransformContext } from '../context/TransformContext';

export function useTransform() {
  return useContext(TransformContext);
}
