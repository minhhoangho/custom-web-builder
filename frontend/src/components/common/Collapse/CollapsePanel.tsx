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

  console.log("collapseContext >> ", collapseContext)
  console.log("props >> ", {
    children,
    header,
    itemKey,
    className,
  })
  console.log("Header >> ", header)
  const renderHeader = () => {
    if (typeof header === 'string') {
      console.log("Typeof header >> ", typeof header)
      return <Typography>{header}</Typography>;
    }
    return 'hahah'
    // return header;
  }
  return (
    <Accordion
      key={itemKey}
      onClick={(e) => handleClick(itemKey, e)}
      className={className}
    >
      <AccordionSummary>
        hello
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
