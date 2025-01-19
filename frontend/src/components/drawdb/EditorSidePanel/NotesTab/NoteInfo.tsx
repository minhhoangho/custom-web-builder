import { useState } from 'react';
// import { Button, Collapse, Input, Popover, TextArea } from '@douyinfe/semi-ui';
// import { IconDeleteStroked, IconCheckboxTick } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Action, noteThemes, ObjectType } from '@constants/editor';
import { useNote, useUndoRedo } from 'src/containers/Editor/hooks';
import { Collapse, Iconify, Popover } from 'src/components/common';
import { Input } from '@components/form/Input';

export default function NoteInfo({ data, nid }) {
  const { updateNote, deleteNote } = useNote();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState({});
  const { t } = useTranslation();

  return (
    <Collapse.Panel
      header={
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {data.title}
        </div>
      }
      itemKey={`${data.id}`}
      id={`scroll_note_${data.id}`}
    >
      <div className="flex items-center mb-2">
        <div className="font-semibold me-2 break-keep">{t('title')}:</div>
        <Input
          value={data.title}
          placeholder={t('title')}
          onInputChange={(value) => updateNote(data.id, { title: value })}
          onFocus={(e) => setEditField({ title: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField.title) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.NOTE,
                nid: data.id,
                undo: editField,
                redo: { title: e.target.value },
                message: t('edit_note', {
                  noteTitle: e.target.value,
                  extra: '[title]',
                }),
              },
            ]);
            setRedoStack([]);
          }}
        />
      </div>
      <div className="flex justify-between align-top">
        <Input
          isTextarea
          placeholder={t('content')}
          value={data.content}
          autosize
          onInputChange={(value) => {
            const textarea = document.getElementById(`note_${data.id}`);
            textarea.style.height = '0';
            textarea.style.height = textarea.scrollHeight + 'px';
            const newHeight = textarea.scrollHeight + 16 + 20 + 4;
            updateNote(data.id, { height: newHeight, content: value });
          }}
          onFocus={(e) =>
            setEditField({ content: e.target.value, height: data.height })
          }
          onBlur={(e) => {
            if (e.target.value === editField.content) return;
            const textarea = document.getElementById(`note_${data.id}`);
            textarea.style.height = '0';
            textarea.style.height = textarea.scrollHeight + 'px';
            const newHeight = textarea.scrollHeight + 16 + 20 + 4;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.NOTE,
                nid: nid,
                undo: editField,
                redo: { content: e.target.value, height: newHeight },
                message: t('edit_note', {
                  noteTitle: e.target.value,
                  extra: '[content]',
                }),
              },
            ]);
            setRedoStack([]);
          }}
          rows={3}
        />
        <div className="ml-2">
          <Popover
            buttonElement={
              <div
                className="h-[32px] w-[32px] rounded mb-2"
                style={{ backgroundColor: data.color }}
              />
            }
            // content={
            //
            // }
            // trigger="click"
            position="topRight"
            // showArrow
          >
            <div className="popover-theme">
              <div className="font-medium mb-1">{t('theme')}</div>
              <hr />
              <div className="py-3">
                {noteThemes.map((c) => (
                  <button
                    key={c}
                    style={{ backgroundColor: c }}
                    className="w-10 h-10 p-3 rounded-full mx-1"
                    onClick={() => {
                      setUndoStack((prev) => [
                        ...prev,
                        {
                          action: Action.EDIT,
                          element: ObjectType.NOTE,
                          nid: nid,
                          undo: { color: data.color },
                          redo: { color: c },
                          message: t('edit_note', {
                            noteTitle: data.title,
                            extra: '[color]',
                          }),
                        },
                      ]);
                      setRedoStack([]);
                      updateNote(nid, { color: c });
                    }}
                  >
                    {data.color === c ? (
                      <Iconify
                        icon="mdi:checkbox-outline"
                        sx={{ color: 'white' }}
                      />
                    ) : (
                      <Iconify icon="mdi:checkbox-outline" sx={{ color: c }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Popover>
          <Button
            startIcon={<Iconify icon="mdi:delete-outline" />}
            color="error"
            onClick={() => deleteNote(nid, true)}
          />
        </div>
      </div>
    </Collapse.Panel>
  );
}
