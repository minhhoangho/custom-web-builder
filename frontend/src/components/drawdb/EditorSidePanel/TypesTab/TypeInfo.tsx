import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Grid } from '@mui/material';
import { Collapse, Iconify } from '@components/common';
import { useDiagram, useType, useUndoRedo } from 'src/containers/Editor/hooks';
import { Action, ObjectType } from '@constants/editor';
import { Input } from '@components/form/Input';
import TypeField from './TypeField';
import { DType } from '../../../../data/interface';

export default function TypeInfo({
  index,
  data,
}: {
  index: number;
  data: DType;
}) {
  const { deleteType, updateType } = useType();
  const { tables, updateField } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState<Partial<DType>>({});
  const { t } = useTranslation();

  return (
    <div id={`scroll_type_${index}`}>
      <Collapse.Panel
        header={
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {data.name}
          </div>
        }
        itemKey={`${index}`}
      >
        <div className="flex items-center mb-2.5">
          <div className="text-md font-semibold break-keep">{t('name')}:</div>
          <Input
            value={data.name}
            // validateStatus={data.name === '' ? 'error' : 'default'}
            placeholder={t('name')}
            className="ml-2"
            onInputChange={(value) => {
              updateType(index, { name: value });
              tables.forEach((table, i) => {
                table.fields.forEach((field, j) => {
                  if (field.type.toLowerCase() === data.name.toLowerCase()) {
                    updateField(i, j, { type: value.toUpperCase() });
                  }
                });
              });
            }}
            onFocus={(e) => setEditField({ name: e.target.value })}
            onBlur={(e) => {
              if (e.target.value === editField.name) return;

              const updatedFields: {
                tid: number;
                fid: number;
              }[] = tables.reduce(
                (
                  acc: {
                    tid: number;
                    fid: number;
                  }[],
                  table,
                ) => {
                  table.fields.forEach((field, i) => {
                    if (field.type.toLowerCase() === data.name.toLowerCase()) {
                      acc.push({ tid: table.id, fid: i });
                    }
                  });
                  return acc;
                },
                [],
              );

              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TYPE,
                  component: 'self',
                  tid: index,
                  undo: editField,
                  redo: { name: e.target.value },
                  updatedFields,
                  message: 'Error edit_type',
                  // message: t('edit_type', {
                  //   typeName: data.name,
                  //   extra: '[name]',
                  // }),
                },
              ]);
              setRedoStack([]);
            }}
          />
        </div>
        {data.fields.map((f, j) => (
          <TypeField key={j} data={f} fid={j} tid={index} />
        ))}
        <Card
          // sx={{ padding: '4px' }}
          sx={{ marginTop: '12px', marginBottom: '12px' }}
          // headerLine={false}
        >
          <Collapse
          // keepDOM lazyRender
          >
            <Collapse.Panel header={t('comment')} itemKey="1">
              <Input
                isTextarea
                name="comment"
                value={data.comment}
                // autosize
                placeholder={t('comment')}
                // rows={1}
                onInputChange={(value) =>
                  // updateType(index, { comment: value }, false)
                  updateType(index, { comment: value })
                }
                onFocus={(e) => setEditField({ comment: e.target.value })}
                onBlur={(e) => {
                  if (e.target.value === editField.comment) return;
                  setUndoStack((prev) => [
                    ...prev,
                    {
                      action: Action.EDIT,
                      element: ObjectType.TYPE,
                      component: 'self',
                      tid: index,
                      undo: editField,
                      redo: { comment: e.target.value },
                      message: 'Error edit_type',
                      // message: t('edit_type', {
                      //   typeName: data.name,
                      //   extra: '[comment]',
                      // }),
                    },
                  ]);
                  setRedoStack([]);
                }}
              />
            </Collapse.Panel>
          </Collapse>
        </Card>
        <Grid container spacing={6} className="mt-2">
          <Grid item xs={6}>
            <Button
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={() => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TYPE,
                    component: 'field_add',
                    tid: index,
                    message: 'Error edit_type',
                    // message: t('edit_type', {
                    //   typeName: data.name,
                    //   extra: '[add field]',
                    // }),
                  },
                ]);
                setRedoStack([]);
                updateType(index, {
                  fields: [
                    ...data.fields,
                    {
                      name: '',
                      type: '',
                    },
                  ],
                });
              }}
            >
              {t('add_field')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              startIcon={<Iconify icon="mdi:delete-outline" />}
              color="error"
              onClick={() => deleteType(index)}
              // block
            >
              {t('delete')}
            </Button>
          </Grid>
        </Grid>
      </Collapse.Panel>
    </div>
  );
}
