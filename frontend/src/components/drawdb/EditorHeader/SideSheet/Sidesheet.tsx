// import { SideSheet as SemiUISideSheet } from "@douyinfe/semi-ui";
import { Drawer } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';
import { SIDESHEET } from '@constants/editor';
import { useSettings } from 'src/containers/Editor/hooks';
import Timeline from './Timeline';
import Todo from './Todo';

export default function Sidesheet({
  type,
  onClose,
}: {
  type: 0 | 1 | 2;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  function getTitle(type: 0 | 1 | 2) {
    switch (type) {
      case SIDESHEET.TIMELINE:
        return (
          <div className="flex items-center">
            <img
              src={
                settings.mode === 'light'
                  ? '/static/images/database/process.png'
                  : '/static/images/database/process_dark.png'
              }
              className="w-7"
              alt="chat icon"
            />
            <div className="ml-3 text-lg">{t('timeline')}</div>
          </div>
        );
      case SIDESHEET.TODO:
        return (
          <div className="flex items-center">
            <img
              src="/static/images/database/calendar.png"
              className="w-7"
              alt="todo icon"
            />
            <div className="ml-3 text-lg">{t('to_do')}</div>
          </div>
        );
      default:
        break;
    }

    return null;
  }

  function getContent(type: 0 | 1 | 2) {
    switch (type) {
      case SIDESHEET.TIMELINE:
        return <Timeline />;
      case SIDESHEET.TODO:
        return <Todo />;
      default:
        break;
    }
    return null;
  }

  return (
    <Drawer
      open={type !== SIDESHEET.NONE}
      onClose={onClose}
      // width={340}
      // title={getTitle(type)}
      sx={{ paddingBottom: '16px' }}
    >
      <Box>
        {getTitle(type)}
        {getContent(type)}
      </Box>
    </Drawer>
  );
}
