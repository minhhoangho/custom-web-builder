export interface CollapseProps {
  activeKey?: string | string[];
  defaultActiveKey?: string | string[];
  onChange?: (activeKey: CollapseProps['activeKey'], e: any) => void;
  // expandIcon?: any;
  // collapseIcon?: any;
  // style?: any;
  // className?: string;
  // keepDOM?: boolean;
  // motion?: boolean;
  // expandIconPosition?: 'left' | 'right'
}
