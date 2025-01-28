import React, { useEffect } from 'react';
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
  const [expanded, setExpanded] = React.useState(false);
  const collapseContext = React.useContext(CollapseContext);

  useEffect(() => {
    if (collapseContext?.activeKey === itemKey) {
      setExpanded(true);
    }
  }, [collapseContext?.activeKey, itemKey]);

  const handleOnChange = (e: React.BaseSyntheticEvent, expanded: boolean) => {
    setExpanded(expanded);
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

  return (
    <Accordion
      key={itemKey}
      // onClick={(e) => handleClick(itemKey, e)}
      onChange={handleOnChange}
      className={clsx('!rounded-none text-sm', className)}
      expanded={expanded}
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
