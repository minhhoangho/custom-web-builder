import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
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

  return (
    <Accordion
      key={itemKey}
      onClick={(e) => handleClick(itemKey, e)}
      className={clsx('!rounded-none text-sm', className)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="font-bold">
        {header}
      </AccordionSummary>
      <AccordionDetails>
        <div>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
}
