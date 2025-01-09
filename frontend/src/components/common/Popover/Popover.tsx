import { Popover as MuiPopover, PopoverOrigin } from '@mui/material'

type PopoverProps = {
  buttonElement: React.ReactNode
  children: React.ReactNode
  origin: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'
  position: { top: number, left: number }
}

const mapOriginToAnchorOrigin = (position: PopoverProps['position']): PopoverOrigin => {
  let result: PopoverOrigin;
  switch (position) {
    case "bottomLeft":
      result = {
        vertical: 'bottom',
        horizontal: 'left',
      }
      break
    case "bottomRight":
      result = {
        vertical: 'bottom',
        horizontal: 'right',
      }
      break
    case "topLeft":
      result = {
        vertical: 'top',
        horizontal: 'left',
      }
      break
    case "topRight":
      result = {
        vertical: 'top',
        horizontal: 'right',
      }
      break
    case "left":
      result = {
        vertical: 'center',
        horizontal: 'left',
      }
      break
    case "right":
      result = {
        vertical: 'center',
        horizontal: 'right',
      }
      break
    case "top":
      result = {
        vertical: 'top',
        horizontal: 'center',
      }
      break
    case "bottom":
      result = {
        vertical: 'bottom',
        horizontal: 'center',
      }
      break
    case "center":
      result = {
        vertical: 'center',
        horizontal: 'center',
      }
      break
    default:
      result = {
        vertical: 'center',
        horizontal: 'center',
      }
  }
  return result
}

export function Popover({
                          children, origin, position, buttonElement
                        }: PopoverProps) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);

  return <div>
    <div onClick={handleClick}>
      {buttonElement}
    </div>
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={mapOriginToAnchorOrigin(origin)}
      anchorPosition={position}
    >
      {children}
    </MuiPopover>
  </div>
}