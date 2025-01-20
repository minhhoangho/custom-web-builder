import { useTranslation } from 'react-i18next';
import { MouseEvent, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useLayout } from 'src/containers/Editor/hooks';
import { Iconify } from '@components/common';

export default function LayoutDropdown() {
  const { layout, setLayout } = useLayout();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const invertLayout = (component: string) =>
    setLayout((prev) => ({ ...prev, [component]: !prev[component] }));

  return (
    <div>
      <div
        className="py-1 mx-2 px-1 hover:bg-gray-300 rounded flex items-center justify-center"
        onClick={handleClick}
      >
        <Iconify icon="mynaui:rows" width={24} height={24} />
        <div>
          <Iconify icon="mdi:caret-down" />
        </div>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => invertLayout('header')}>
          <div className="flex items-center">
            {layout.header ? (
              <Iconify icon="mdi:tick" className="mr-1" />
            ) : (
              <div className="px-2" />
            )}
            <span>{t('header')}</span>
          </div>
        </MenuItem>
        <MenuItem onClick={() => invertLayout('sidebar')}>
          <div className="flex items-center">
            {layout.sidebar ? (
              <Iconify icon="mdi:tick" className="mr-1" />
            ) : (
              <div className="px-2" />
            )}
            <span>{t('sidebar')}</span>
          </div>
        </MenuItem>
        <MenuItem onClick={() => invertLayout('issues')}>
          <div className="flex items-center">
            {layout.issues ? (
              <Iconify icon="mdi:tick" className="mr-1" />
            ) : (
              <div className="px-2" />
            )}
            <span>{t('issues')}</span>
          </div>
        </MenuItem>
        {/*<Divider />*/}
      </Menu>
    </div>
  );
}
