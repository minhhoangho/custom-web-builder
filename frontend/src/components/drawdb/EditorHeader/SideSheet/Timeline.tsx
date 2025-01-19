import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { useUndoRedo } from 'src/containers/Editor/hooks'; // import { List } from "@douyinfe/semi-ui";
// import { List } from "@douyinfe/semi-ui";

export default function Timeline() {
  const { undoStack } = useUndoRedo();
  const { t } = useTranslation();

  if (undoStack.length > 0) {
    return (
      <List className="sidesheet-theme">
        {[...undoStack].reverse().map((e, i) => (
          <ListItem
            key={i}
            style={{ padding: '4px 18px 4px 18px' }}
            className="hover-1"
          >
            <div className="flex items-center py-1 w-full">
              <i className="block fa-regular fa-circle fa-xs" />
              <div className="ml-2">{e.message}</div>
            </div>
          </ListItem>
        ))}
      </List>
    );
  } else {
    return <div className="m-5 sidesheet-theme">{t('no_activity')}</div>;
  }
}
