import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import clsx from 'clsx';
import { CollapseContext } from './context';

type CollapsePanelProps = {
  id?: string;
  className?: string;
  itemKey: string;
  header: React.ReactNode | string | HTMLElement;
  children: React.ReactNode;
};

export function CollapsePanel({
  children,
  header,
  itemKey,
  className,
}: CollapsePanelProps) {
  const collapseContext = React.useContext(CollapseContext);

  const handleClick = (itemKey: string, e: React.MouseEvent) => {
    if (collapseContext?.onChange) {
      collapseContext.onChange(itemKey, e);
    }
  };
  const renderHeader = (_header: React.ReactNode | string | HTMLElement) => {
    if (typeof _header === 'string') {
      return <Typography>{_header}</Typography>;
    }
    if (_header instanceof HTMLElement) {
      return React.createElement(
        _header.tagName.toLowerCase(),
        {},
        _header.innerHTML,
      );
    }
    return _header;
  };

  console.log('Expalend >> ', collapseContext?.activeKey === itemKey);
  console.log('collapseContext?.activeKey >> ', collapseContext?.activeKey);
  console.log('itemKey >> ', itemKey);

  return (
    <Accordion
      key={itemKey}
      onClick={(e) => handleClick(itemKey, e)}
      className={clsx('!rounded-none text-sm', className)}
      expanded={collapseContext?.activeKey === itemKey}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="font-bold">
        {renderHeader(header)}
      </AccordionSummary>
      <AccordionDetails>
        <div>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
}
