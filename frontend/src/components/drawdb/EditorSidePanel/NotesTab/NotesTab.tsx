import { Button, Collapse } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { useNotes, useSelect } from 'src/containers/Editor/hooks';
import SearchBar from './SearchBar';
import NoteInfo from './NoteInfo';
import Empty from '../Empty';

export default function NotesTab() {
  const { notes, addNote } = useNotes();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-2">
        <SearchBar
          setActiveKey={(activeKey) =>
            setSelectedElement((prev) => ({
              ...prev,
              id: parseInt(activeKey),
            }))
          }
        />
        <div>
          <Button
            startIcon={<Iconify icon="mdi:plus" />}
            block
            onClick={() => addNote()}
          >
            {t('add_note')}
          </Button>
        </div>
      </div>
      {notes.length <= 0 ? (
        <Empty title={t('no_notes')} text={t('no_notes_text')} />
      ) : (
        <Collapse
          activeKey={selectedElement.open ? `${selectedElement.id}` : ''}
          keepDOM
          lazyRender
          onChange={(activeKey) => {
            setSelectedElement((prev) => ({
              ...prev,
              id: parseInt(activeKey),
              open: true,
            }));
          }}
          accordion
        >
          {notes.map((n, i) => (
            <NoteInfo data={n} key={i} nid={i} />
          ))}
        </Collapse>
      )}
    </>
  );
}
