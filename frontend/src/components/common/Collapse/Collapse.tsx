import React from 'react';
import { CollapseProps } from './interface';
import { CollapsePanel } from './CollapsePanel';
import { CollapseContext } from './context';

export interface CollapseReactProps extends CollapseProps {
  children: React.ReactNode;
  activeKey?: string;
  onChange?: (
    activeKey: string,
    e: React.MouseEvent,
  ) => void;
}

function Collapse({ children, onChange, activeKey }: CollapseReactProps) {
  console.log("Collapse sssssss >> activeKey", activeKey)
  return (
    <div>
      <CollapseContext.Provider
        value={{
          activeKey,
          onChange
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
}

Collapse.Panel = CollapsePanel;
export {
  Collapse
}
