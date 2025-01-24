import { Popover as MuiPopover, PopoverOrigin } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type PopoverProps = {
  className?: string;
  style?: React.CSSProperties;
  visible?: boolean;
  buttonElement: React.ReactNode;
  children: React.ReactNode;
  position:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight';
  // position: { top: number | string; left: number | string };
  onClickOutSide?: () => void;
};

const mapPositionToAnchorOrigin = (
  position: PopoverProps['position'],
): PopoverOrigin => {
  let result: PopoverOrigin;
  switch (position) {
    case 'bottomLeft':
      result = {
        vertical: 'bottom',
        horizontal: 'left',
      };
      break;
    case 'bottomRight':
      result = {
        vertical: 'bottom',
        horizontal: 'right',
      };
      break;
    case 'topLeft':
      result = {
        vertical: 'top',
        horizontal: 'left',
      };
      break;
    case 'topRight':
      result = {
        vertical: 'top',
        horizontal: 'right',
      };
      break;
    case 'left':
      result = {
        vertical: 'center',
        horizontal: 'left',
      };
      break;
    case 'right':
      result = {
        vertical: 'center',
        horizontal: 'right',
      };
      break;
    case 'top':
      result = {
        vertical: 'top',
        horizontal: 'center',
      };
      break;
    case 'bottom':
      result = {
        vertical: 'bottom',
        horizontal: 'center',
      };
      break;
    default:
      result = {
        vertical: 'bottom',
        horizontal: 'center',
      };
  }
  return result;
};

export function Popover({
  children,
  position,
  buttonElement,
  visible,
  onClickOutSide,
  className,
  style,
}: PopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClickOutSide?.();
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutSide]);

  return (
    <div ref={popoverRef} style={style}>
      <div onClick={handleClick}>{buttonElement}</div>
      <MuiPopover
        open={visible ?? open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={mapPositionToAnchorOrigin(position)}
      >
        <div className={clsx('p-3 text-sm text-wrap w-[200px]', className)}>
          {children}
        </div>
      </MuiPopover>
    </div>
  );
}
