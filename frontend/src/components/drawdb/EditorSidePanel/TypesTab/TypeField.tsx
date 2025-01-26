import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { Iconify, SelectField } from '@components/common';
import { Action, ObjectType } from '@constants/editor';
import { dbToTypes } from 'src/data/datatypes';
import {
  useDiagram,
  useEnum,
  useType,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { Input, TagInput } from '@components/form/Input';
import { Popover } from '@components/common/Popover';
import { DDataType, DField } from '../../../../data/interface';

export default function TypeField({
  data,
  tid,
  fid,
}: {
  data: DField;
  tid: number;
  fid: number;
}) {
  const { types, updateType } = useType();
  const { enums } = useEnum();
  const { database } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState<Partial<DField>>({});
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} className="hover-1 my-2">
      <Grid item xs={5}>
        <Input
          value={data.name}
          // validateStatus={data.name === '' ? 'error' : 'default'}
          placeholder="name"
          onInputChange={(value) =>
            updateType(tid, {
              fields: types[tid]?.fields.map((e, id) =>
                id === fid ? { ...data, name: value } : e,
              ),
            })
          }
          onFocus={(e) => setEditField({ name: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField['name']) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TYPE,
                component: 'field',
                tid: tid,
                fid: fid,
                undo: editField,
                redo: { name: e.target.value },
                message: 'Error edit_type',
                // message: t('edit_type', {
                //   typeName: data.name,
                //   extra: '[field]',
                // }),
              },
            ]);
            setRedoStack([]);
          }}
        />
      </Grid>
      <Grid item xs={5}>
        <SelectField
          name="type_field"
          className="w-full"
          options={[
            ...Object.keys(dbToTypes[database]).map((value) => ({
              label: value,
              value: value,
            })),
            ...types
              .filter(
                (type) => type.name.toLowerCase() !== data.name.toLowerCase(),
              )
              .map((type) => ({
                label: type.name.toUpperCase(),
                value: type.name.toUpperCase(),
              })),
            ...enums.map((type) => ({
              label: type.name.toUpperCase(),
              value: type.name.toUpperCase(),
            })),
          ]}
          value={data.type}
          label="type"
          onSelectChange={(value: DDataType) => {
            if (value === data.type) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TYPE,
                component: 'field',
                tid: tid,
                fid: fid,
                undo: { type: data?.type },
                redo: { type: value },
                message: 'Error edit_type',
                // message: t('edit_type', {
                //   typeName: data.name,
                //   extra: '[field]',
                // }),
              },
            ]);
            setRedoStack([]);
            if (value === 'ENUM' || value === 'SET') {
              updateType(tid, {
                fields: types[tid]?.fields?.map((e, id) =>
                  id === fid
                    ? {
                        ...data,
                        type: value,
                        values: data.values ? [...data.values] : [],
                      }
                    : e,
                ),
              });
            } else if (
              dbToTypes[database][value].isSized ||
              dbToTypes[database][value].hasPrecision
            ) {
              updateType(tid, {
                fields: types[tid]?.fields.map((e, id) =>
                  id === fid
                    ? {
                        ...data,
                        type: value,
                        size: dbToTypes[database][value].defaultSize,
                      }
                    : e,
                ),
              });
            } else {
              updateType(tid, {
                fields: types[tid]?.fields.map((e, id) =>
                  id === fid ? { ...data, type: value } : e,
                ),
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <Popover
          buttonElement={
            <Button
              startIcon={<Iconify icon="ic:round-more-vert" />}
              color="secondary"
              variant="contained"
              // type="tertiary"
            />
          }
          position="bottomRight"
        >
          <div className="popover-theme w-[240px]">
            {(data.type === 'ENUM' || data.type === 'SET') && (
              <>
                <div className="font-semibold mb-1">{data.type} Value</div>
                <TagInput
                  separator=","
                  value={data.values}
                  // validateStatus={
                  //   !data.values || data.values.length === 0
                  //     ? 'error'
                  //     : 'default'
                  // }
                  className="my-2"
                  placeholder={t('use_for_batch_input')}
                  onInputChange={(v) =>
                    updateType(tid, {
                      fields: types[tid]?.fields.map((e, id) =>
                        id === fid ? { ...data, values: v } : e,
                      ),
                    })
                  }
                  onFocus={() => setEditField({ values: data.values })}
                  onBlur={() => {
                    if (
                      JSON.stringify(editField?.values ?? {}) ===
                      JSON.stringify(data.values)
                    )
                      return;
                    setUndoStack((prev) => [
                      ...prev,
                      {
                        action: Action.EDIT,
                        element: ObjectType.TYPE,
                        component: 'field',
                        tid: tid,
                        fid: fid,
                        undo: editField,
                        redo: { values: data.values },
                        message: 'Error edit_type',
                        // message: t('edit_type', {
                        //   typeName: data.name,
                        //   extra: '[field]',
                        // }),
                      },
                    ]);
                    setRedoStack([]);
                  }}
                />
              </>
            )}
            {dbToTypes[database][data.type].isSized && (
              <>
                <div className="font-semibold">{t('size')}</div>
                <Input
                  type="number"
                  className="my-2 w-full"
                  placeholder="Size"
                  value={data.size}
                  onInputChange={(value) =>
                    updateType(tid, {
                      fields: types[tid]?.fields.map((e, id) =>
                        id === fid ? { ...data, size: Number(value) } : e,
                      ),
                    })
                  }
                  onFocus={(e) => setEditField({ size: e.target.value })}
                  onBlur={(e) => {
                    if (e.target.value === editField.size) return;
                    setUndoStack((prev) => [
                      ...prev,
                      {
                        action: Action.EDIT,
                        element: ObjectType.TABLE,
                        component: 'field',
                        tid: tid,
                        fid: fid,
                        undo: editField,
                        redo: { size: e.target.value },
                        message: 'Error edit_type',
                        // message: t('edit_type', {
                        //   typeName: data.name,
                        //   extra: '[field]',
                        // }),
                      },
                    ]);
                    setRedoStack([]);
                  }}
                />
              </>
            )}
            {dbToTypes[database][data.type].hasPrecision && (
              <>
                <div className="font-semibold">{t('precision')}</div>
                <Input
                  className="my-2 w-full"
                  placeholder={t('set_precision')}
                  // validateStatus={
                  //   /^\(\d+,\s*\d+\)$|^$/.test(data.size)
                  //     ? 'default'
                  //     : 'error'
                  // }
                  value={data.size}
                  onInputChange={(value) =>
                    updateType(tid, {
                      fields: types[tid]?.fields.map((e, id) =>
                        id === fid ? { ...data, size: Number(value) } : e,
                      ),
                    })
                  }
                  onFocus={(e) =>
                    setEditField({ size: Number(e.target.value) })
                  }
                  onBlur={(e) => {
                    if (e.target.value === editField.size) return;
                    setUndoStack((prev) => [
                      ...prev,
                      {
                        action: Action.EDIT,
                        element: ObjectType.TABLE,
                        component: 'field',
                        tid: tid,
                        fid: fid,
                        undo: editField,
                        redo: { size: e.target.value },
                        message: 'Error edit_type',
                        // message: t('edit_type', {
                        //   typeName: data.name,
                        //   extra: '[field]',
                        // }),
                      },
                    ]);
                    setRedoStack([]);
                  }}
                />
              </>
            )}
            <Button
              startIcon={<Iconify icon="mdi:delete-outline" />}
              color="error"
              onClick={() => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TYPE,
                    component: 'field_delete',
                    tid: tid,
                    fid: fid,
                    data: data,
                    message: 'Error edit_type',
                    // message: t('edit_type', {
                    //   typeName: data.name,
                    //   extra: '[delete field]',
                    // }),
                  },
                ]);
                updateType(tid, {
                  fields: types[tid]?.fields.filter((_, k) => k !== fid),
                });
              }}
            >
              Delete
            </Button>
          </div>
        </Popover>
      </Grid>
    </Grid>
  );
}
