import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Action, defaultBlue, ObjectType } from '@constants/editor';
import { useDiagram, useUndoRedo } from 'src/containers/Editor/hooks';
import {
  Collapse,
  ColorPalette,
  Iconify,
  Popover,
} from 'src/components/common';
import { Input } from '@components/form/Input';
import { DField, DTable } from 'src/data/interface';
import { dbToTypes } from 'src/data/datatypes';
import IndexDetails from '@components/drawdb/EditorSidePanel/TablesTab/IndexDetails';
import TableField from '@components/drawdb/EditorSidePanel/TablesTab/TableField';

export default function TableInfo({ data }: { data: DTable }) {
  const { t } = useTranslation();
  console.log('TableInfo data', data);
  const [indexActiveKey, setIndexActiveKey] = useState('');
  const { deleteTable, updateTable, updateField, setRelationships, database } =
    useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState<any>({});
  const [drag, setDrag] = useState({
    draggingElementIndex: null,
    draggingOverIndexList: [],
  });

  // console.log('DEBUG: TableInfo -> data', data);
  // console.log('DEBUG: TableInfo -> editField', editField);
  // console.log('DEBUG: TableInfo -> drag', drag);
  // console.log('DEBUG: TableInfo -> indexActiveKey', indexActiveKey);

  return (
    <div>
      <div className="flex items-center mb-2.5">
        <div className="text-md font-semibold break-keep">{t('name')}:</div>
        <Input
          value={data.name}
          // validateStatus={data.name.trim() === '' ? 'error' : 'default'}
          placeholder={t('name')}
          className="ml-2"
          onInputChange={(value) => updateTable(data.id, { name: value })}
          onFocus={(e) => setEditField({ name: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField.name) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: 'self',
                tid: data.id,
                undo: editField,
                redo: { name: e.target.value },
                message: t('edit_table'),
              },
            ]);
            setRedoStack([]);
          }}
        />
      </div>
      {data.fields.map((f, j) => (
        <div
          key={'field_' + j}
          className={`cursor-pointer ${drag.draggingOverIndexList.includes(j) ? 'opacity-25' : ''}`}
          // style={{ direction: 'ltr' }}
          draggable
          onDragStart={() => {
            setDrag((prev) => ({ ...prev, draggingElementIndex: j }));
          }}
          onDragLeave={() => {
            setDrag((prev) => ({
              ...prev,
              draggingOverIndexList: prev.draggingOverIndexList.filter(
                (index) => index !== j,
              ),
            }));
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (drag.draggingElementIndex !== null) {
              if (j !== drag.draggingElementIndex) {
                setDrag((prev) => {
                  if (prev.draggingOverIndexList.includes(j)) {
                    return prev;
                  }

                  return {
                    ...prev,
                    draggingOverIndexList: prev.draggingOverIndexList.concat(j),
                  };
                });
              }

              return;
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            const index = drag.draggingElementIndex;
            setDrag({ draggingElementIndex: null, draggingOverIndexList: [] });
            if (index === null || index === j) {
              return;
            }

            const a: DField | undefined = data.fields[index];
            const b: DField | undefined = data.fields[j];
            if (!a || !b) return;

            updateField(data.id, index, {
              ...b,
              ...(!dbToTypes?.[database]?.[b.type]?.isSized && { size: '' }),
              ...(!dbToTypes?.[database]?.[b.type]?.hasCheck && { check: '' }),
              ...(dbToTypes?.[database]?.[b.type]?.noDefault && {
                default: '',
              }),
              id: index,
            });
            updateField(data.id, j, {
              ...a,
              ...(!dbToTypes[database][a.type].isSized && { size: '' }),
              ...(!dbToTypes[database][a.type].hasCheck && { check: '' }),
              ...(!dbToTypes[database][a.type].noDefault && { default: '' }),
              id: j,
            });

            setRelationships((prev) =>
              prev.map((e) => {
                if (e.startTableId === data.id) {
                  if (e.startFieldId === index) {
                    return { ...e, startFieldId: j };
                  }
                  if (e.startFieldId === j) {
                    return { ...e, startFieldId: index };
                  }
                }
                if (e.endTableId === data.id) {
                  if (e.endFieldId === index) {
                    return { ...e, endFieldId: j };
                  }
                  if (e.endFieldId === j) {
                    return { ...e, endFieldId: index };
                  }
                }
                return e;
              }),
            );
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setDrag({ draggingElementIndex: null, draggingOverIndexList: [] });
          }}
        >
          <TableField data={f} tid={data.id} index={j} />
        </div>
      ))}
      {data.indices.length > 0 && (
        <div
          // bodyStyle={{ padding: '4px' }}
          style={{ marginTop: '12px', marginBottom: '12px' }}
          // headerLine={false}
        >
          <Collapse
            activeKey={indexActiveKey}
            // keepDOM
            // lazyRender
            onChange={(itemKey, _e) => setIndexActiveKey(itemKey)}
            // accordion
          >
            <Collapse.Panel header="indices" itemKey="1">
              {data.indices.map((idx: any, k: number) => (
                <IndexDetails
                  key={'index_' + k}
                  data={idx}
                  iid={k}
                  tid={data.id}
                  fields={data.fields.map((e) => ({
                    value: e.name,
                    label: e.name,
                  }))}
                />
              ))}
            </Collapse.Panel>
          </Collapse>
        </div>
      )}
      <div
        // bodyStyle={{ padding: '4px' }}
        className="my-3 p-1 rounded border-[1px] border-gray-200"
        // headerLine={false}
      >
        <Collapse>
          <Collapse.Panel header={t('comment')} itemKey="1">
            <div>
              <Input
                isTextarea
                name="comment"
                value={data.comment}
                // autosize
                placeholder={t('comment')}
                // rows={1}
                onInputChange={(value) =>
                  updateTable(data.id, { comment: value }, false)
                }
                onFocus={(e) => setEditField({ comment: e.target.value })}
                onBlur={(e) => {
                  if (e.target.value === editField.comment) return;
                  setUndoStack((prev) => [
                    ...prev,
                    {
                      action: Action.EDIT,
                      element: ObjectType.TABLE,
                      component: 'self',
                      tid: data.id,
                      undo: editField,
                      redo: { comment: e.target.value },
                      message: t('edit_table'),
                    },
                  ]);
                  setRedoStack([]);
                }}
              />
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className="flex justify-between items-center gap-1 mb-2">
        <div>
          <Popover
            buttonElement={
              (
                <div
                  className="h-[32px] w-[32px] rounded"
                  style={{ backgroundColor: data.color }}
                />
              ) as React.ReactNode
            }
            // trigger="click"
            position="bottomLeft"
            // showArrow
          >
            <div className="popover-theme">
              <ColorPalette
                currentColor={data.color}
                onClearColor={() => {
                  setUndoStack((prev) => [
                    ...prev,
                    {
                      action: Action.EDIT,
                      element: ObjectType.TABLE,
                      component: 'self',
                      tid: data.id,
                      undo: { color: data.color },
                      redo: { color: defaultBlue },
                      message: t('edit_table'),
                    },
                  ]);
                  setRedoStack([]);
                  updateTable(data.id, { color: defaultBlue });
                }}
                onPickColor={(c) => {
                  setUndoStack((prev) => [
                    ...prev,
                    {
                      action: Action.EDIT,
                      element: ObjectType.TABLE,
                      component: 'self',
                      tid: data.id,
                      undo: { color: data.color },
                      redo: { color: c },
                      message: t('edit_table'),
                    },
                  ]);
                  setRedoStack([]);
                  updateTable(data.id, { color: c });
                }}
              />
            </div>
          </Popover>
        </div>
        <div className="flex gap-1">
          <Button
            variant="contained"
            className="!bg-gray-200 !text-blue-500 !px-1.5 !rounded"
            onClick={() => {
              setIndexActiveKey('1');
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'index_add',
                  tid: data.id,
                  message: t('edit_table'),
                },
              ]);
              setRedoStack([]);
              updateTable(data.id, {
                indices: [
                  ...data.indices,
                  {
                    id: data.indices.length,
                    name: `${data.name}_index_${data.indices.length}`,
                    unique: false,
                    fields: [],
                  },
                ],
              });
            }}
          >
            {t('add_index')}
          </Button>
          <Button
            variant="contained"
            className="!bg-gray-200 !text-blue-500 !px-1.5 !rounded"
            onClick={() => {
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'field_add',
                  tid: data.id,
                  message: t('edit_table'),
                },
              ]);
              setRedoStack([]);
              updateTable(data.id, {
                fields: [
                  ...data.fields,
                  {
                    name: '',
                    type: '',
                    default: '',
                    check: '',
                    primary: false,
                    unique: false,
                    notNull: false,
                    increment: false,
                    comment: '',
                    id: data.fields.length,
                  },
                ],
              });
            }}
            // block
          >
            {t('add_field')}
          </Button>
          <button
            className="!bg-gray-200 !text-red-500 !px-1.5 !rounded w-9 cursor-pointer hover:shadow"
            color="error"
            onClick={() => deleteTable(data.id)}
          >
            <Iconify icon="mdi:delete-outline" />
          </button>
        </div>
      </div>
    </div>
  );
}
