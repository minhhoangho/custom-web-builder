import { createContext } from 'react';
import { CollapseProps } from './interface';

export const CollapseContext = createContext<CollapseProps | null>(null);
