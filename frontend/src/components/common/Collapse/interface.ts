import React from "react";

export interface CollapseProps {
  activeKey?: string;
  onChange?: (activeKey: string, e: any) => void;
  children: React.ReactNode;
  // expandIcon?: any;
  // collapseIcon?: any;
  // style?: any;
  // className?: string;
  // keepDOM?: boolean;
  // motion?: boolean;
  // expandIconPosition?: 'left' | 'right'
}
