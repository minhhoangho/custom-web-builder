import { Button, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Action, ObjectType } from '@constants/editor';
import { useDiagram, useUndoRedo } from 'src/containers/Editor/hooks';
import { Iconify, Popover, SelectField as Select } from '@components/common';
import { Input } from '@components/form/Input';

export default function IndexDetails({
  data,
  fields,
  iid,
  tid,
}: {
  data: {
    name: string;
    fields: number[];
    unique: boolean;
  };
  fields: { label: string; value: number }[];
  iid: number;
  tid: number;
}) {
  const { t } = useTranslation();
  const { tables, updateTable } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState<{
    name: string;
  }>();

  return (
    <div className="flex justify-between items-center mb-2">
      <Select
        label={t('select_fields')}
        multiple
        // validateStatus={data.fields.length === 0 ? 'error' : 'default'}
        options={fields}
        className="w-full"
        value={data.fields}
        onSelectChange={(value) => {
          setUndoStack((prev) => [
            ...prev,
            {
              action: Action.EDIT,
              element: ObjectType.TABLE,
              component: 'index',
              tid: tid,
              iid: iid,
              undo: {
                fields: [...data.fields],
              },
              redo: {
                fields: [...value],
              },
              message: t('edit_table', {
                tableName: tables[tid]?.name,
                extra: '[index field]',
              }),
            },
          ]);
          setRedoStack([]);
          updateTable(tid, {
            indices: tables[tid]?.indices.map((index) =>
              index.id === iid
                ? {
                    ...index,
                    fields: [...value],
                  }
                : index,
            ),
          });
        }}
      />
      <Popover
        buttonElement={
          <Button
            startIcon={<Iconify icon="ic:round-more-vert" />}
            variant="outlined"
            sx={{ marginLeft: '12px' }}
          />
        }
        // trigger="click"
        position="topRight"
        // showArrow
      >
        <div className="px-1 popover-theme">
          <div className="font-semibold mb-1">{t('name')}:</div>
          <Input
            value={data.name}
            placeholder={t('name')}
            // validateStatus={data.name.trim() === '' ? 'error' : 'default'}
            onFocus={() =>
              setEditField({
                name: data.name,
              })
            }
            onInputChange={(value) =>
              updateTable(tid, {
                indices: tables[tid]?.indices.map((index) =>
                  index.id === iid
                    ? {
                        ...index,
                        name: value,
                      }
                    : index,
                ),
              })
            }
            onBlur={(e) => {
              if (e.target.value === editField?.name) return;
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'index',
                  tid: tid,
                  iid: iid,
                  undo: editField,
                  redo: { name: e.target.value },
                  message: t('edit_table', {
                    tableName: tables[tid]?.name,
                    extra: '[index]',
                  }),
                },
              ]);
              setRedoStack([]);
            }}
          />
          <div className="flex justify-between items-center my-3">
            <div className="font-medium">{t('unique')}</div>
            <Checkbox
              value="unique"
              checked={data.unique}
              onChange={(checkedValues) => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TABLE,
                    component: 'index',
                    tid: tid,
                    iid: iid,
                    undo: {
                      [checkedValues.target.value]:
                        !checkedValues.target.checked,
                    },
                    redo: {
                      [checkedValues.target.value]:
                        checkedValues.target.checked,
                    },
                    message: t('edit_table', {
                      tableName: tables[tid]?.name,
                      extra: '[index field]',
                    }),
                  },
                ]);
                setRedoStack([]);
                updateTable(tid, {
                  indices: tables[tid]?.indices.map((index) =>
                    index.id === iid
                      ? {
                          ...index,
                          [checkedValues.target.value]:
                            checkedValues.target.checked,
                        }
                      : index,
                  ),
                });
              }}
            ></Checkbox>
          </div>
          <Button
            startIcon={<Iconify icon="mdi:delete-outline" />}
            color="error"
            // block
            onClick={() => {
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'index_delete',
                  tid: tid,
                  data: data,
                  message: t('edit_table', {
                    tableName: tables[tid]?.name,
                    extra: '[delete index]',
                  }),
                },
              ]);
              setRedoStack([]);
              updateTable(tid, {
                indices: tables[tid]?.indices
                  .filter((e) => e.id !== iid)
                  .map((e, j) => ({
                    ...e,
                    id: j,
                  })),
              });
            }}
          >
            {t('delete')}
          </Button>
        </div>
      </Popover>
    </div>
  );
}
