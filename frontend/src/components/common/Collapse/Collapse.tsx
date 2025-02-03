import React from 'react';
import { CollapseProps } from './interface';
import { CollapsePanel } from './CollapsePanel';
import { CollapseContext } from './context';

export interface CollapseReactProps extends CollapseProps {
  children: React.ReactNode;
  activeKey?: string;
  onChange?: (activeKey: string, e: React.MouseEvent) => void;
}

function Collapse({ children, onChange, activeKey }: CollapseReactProps) {
  return (
    <div>
      <CollapseContext.Provider
        value={{
          activeKey: activeKey as string,
          onChange: onChange as (activeKey: string, e: React.MouseEvent) => void,
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
}

Collapse.Panel = CollapsePanel;
export { Collapse };
