import React from 'react';
import { CollapseProps } from './interface';
import { CollapsePanel } from './CollapsePanel';
import { CollapseContext } from './context';

export interface CollapseReactProps extends CollapseProps {
  children: React.ReactNode;
  onChange?: (
    activeKey: CollapseProps['activeKey'],
    e: React.MouseEvent,
  ) => void;
}

export function Collapse({ children, onChange, ...props }: CollapseReactProps) {
  return (
    <div>
      <CollapseContext.Provider
        value={{
          activeKey: props.activeKey,
          defaultActiveKey: props.defaultActiveKey,
          onChange: onChange,
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
}

Collapse.Panel = CollapsePanel;
