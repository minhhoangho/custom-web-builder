import { useTranslation } from 'react-i18next';
import { MouseEvent, useState } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
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

  const invertLayout = (component) =>
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
        <MenuItem
          icon={
            layout.header ? (
              <Iconify icon="mdi:checkbox-outline" />
            ) : (
              <div className="px-2" />
            )
          }
          onClick={() => invertLayout('header')}
        >
          {t('header')}
        </MenuItem>
        <MenuItem
          icon={
            layout.sidebar ? (
              <Iconify icon="mdi:checkbox-outline" />
            ) : (
              <div className="px-2" />
            )
          }
          onClick={() => invertLayout('sidebar')}
        >
          {t('sidebar')}
        </MenuItem>
        <MenuItem
          icon={
            layout.issues ? (
              <Iconify icon="mdi:checkbox-outline" />
            ) : (
              <div className="px-2" />
            )
          }
          onClick={() => invertLayout('issues')}
        >
          {t('issues')}
        </MenuItem>
        <Divider />
      </Menu>
    </div>
  );
}
