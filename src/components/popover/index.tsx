import { List } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
import * as React from 'react';

export default function CustomPopover({ children, handleClick: onClick }:{ children: React.ReactNode, handleClick?: () => void}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    onClick && onClick();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <List sx={{ color: "white" }} />
      </IconButton>
      <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
      >
        {children}
      </Popover>
    </>
  );
}