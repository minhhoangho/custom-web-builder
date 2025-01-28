import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNote, useSelect } from 'src/containers/Editor/hooks';
import { Collapse, Iconify } from '@components/common';
import SearchBar from './SearchBar';
import NoteInfo from './NoteInfo';
import Empty from '../Empty';

export default function NotesTab() {
  const { notes, addNote } = useNote();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-2 flex-col">
        <div>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => addNote()}
          >
            {t('add_note')}
          </Button>
        </div>

        <SearchBar
          setActiveKey={(activeKey: string) =>
            setSelectedElement((prev) => ({
              ...prev,
              id: parseInt(activeKey),
            }))
          }
        />
      </div>
      {notes.length <= 0 ? (
        <Empty title={t('no_notes')} text={t('no_notes_text')} />
      ) : (
        <Collapse
          activeKey={selectedElement.open ? `${selectedElement.id}` : ''}
          // keepDOM
          // lazyRender
          onChange={(activeKey) => {
            setSelectedElement((prev) => ({
              ...prev,
              id: parseInt(activeKey),
              open: true,
            }));
          }}
        >
          {notes.map((n, i) => (
            <NoteInfo data={n} key={i} nid={i} />
          ))}
        </Collapse>
      )}
    </>
  );
}
