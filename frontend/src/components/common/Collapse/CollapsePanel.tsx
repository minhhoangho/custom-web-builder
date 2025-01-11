import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { CollapseContext } from './context';

type CollapsePanelProps = {
  id?: string;
  itemKey: string;
  header: React.ReactNode | string | HTMLElement;
  children: React.ReactNode;
};

export function CollapsePanel({
  children,
  header,
  itemKey,
}: CollapsePanelProps) {
  const collapseContext = React.useContext(CollapseContext);

  const handleClick = (itemKey: string, e: React.MouseEvent) => {
    if (collapseContext?.onChange) {
      collapseContext.onChange(itemKey, e);
    }
  };
  return (
    <Accordion key={itemKey} onClick={(e) => handleClick(itemKey, e)}>
      <AccordionSummary>
        <Typography component="span">{header}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
