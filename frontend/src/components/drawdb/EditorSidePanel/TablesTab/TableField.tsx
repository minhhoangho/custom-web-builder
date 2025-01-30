// import { Button, Popover, Select } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import clsx from 'clsx';
import { Iconify, Popover, SelectField as Select } from '@components/common';
import { Input } from '@components/form/Input';
import {
  useDiagram,
  useEnum,
  useType,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { Action, ObjectType } from '@constants/editor';
import { dbToTypes } from 'src/data/datatypes';
import FieldDetails from './FieldDetails';
import { DField } from '../../../../data/interface';

export default function TableField({
  data,
  tid,
  index,
}: {
  data: DField;
  tid: number;
  index: number;
}) {
  const { updateField } = useDiagram();
  const { types } = useType();
  const { enums } = useEnum();
  const { tables, database } = useDiagram();
  const { t } = useTranslation();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState({});
  // console.log('Table field data ', data);
  return (
    <Grid container spacing={0.5} className="hover-1 my-2">
      <Grid item xs={3}>
        <Input
          id={`scroll_table_${tid}_input_${index}`}
          value={data.name}
          // validateStatus={data.name.trim() === '' ? 'error' : 'default'}
          placeholder="Name"
          onInputChange={(value) => updateField(tid, index, { name: value })}
          onFocus={(e) => setEditField({ name: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField['name']) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: 'field',
                tid: tid,
                fid: index,
                undo: editField,
                redo: { name: e.target.value },
                message: t('edit_table', {
                  tableName: tables[tid]?.name,
                  extra: '[field]',
                }),
              },
            ]);
            setRedoStack([]);
          }}
        />
      </Grid>
      <Grid item xs={4.5}>
        <Select
          className="w-full h-9"
          options={[
            ...Object.keys(dbToTypes?.[database] ?? {})?.map((value) => ({
              label: value,
              value: value,
            })),
            ...types.map((type) => ({
              label: type.name.toUpperCase(),
              value: type.name.toUpperCase(),
            })),
            ...enums.map((type) => ({
              label: type.name.toUpperCase(),
              value: type.name.toUpperCase(),
            })),
          ]}
          // filter
          value={data.type}
          // validateStatus={data.type === '' ? 'error' : 'default'}
          // placeholder="Type"
          onSelectChange={(event) => {
            const value: string = event.target.value;
            if (value === data.type) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: 'field',
                tid: tid,
                fid: index,
                undo: { type: data.type },
                redo: { type: value },
                message: t('edit_table', {
                  tableName: tables[tid]?.name,
                  extra: '[field]',
                }),
              },
            ]);
            setRedoStack([]);
            const incr =
              data.increment && !!dbToTypes[database][value].canIncrement;

            if (value === 'ENUM' || value === 'SET') {
              updateField(tid, index, {
                type: value,
                default: '',
                values: data.values ? [...data.values] : [],
                increment: incr,
              });
            } else if (
              dbToTypes[database][value].isSized ||
              dbToTypes[database][value].hasPrecision
            ) {
              updateField(tid, index, {
                type: value,
                size: dbToTypes[database][value].defaultSize,
                increment: incr,
              });
            } else if (!dbToTypes[database][value].hasDefault || incr) {
              updateField(tid, index, {
                type: value,
                increment: incr,
                default: '',
                size: '',
                values: [],
              });
            } else if (dbToTypes[database][value].hasCheck) {
              updateField(tid, index, {
                type: value,
                check: '',
                increment: incr,
              });
            } else {
              updateField(tid, index, {
                type: value,
                increment: incr,
                size: '',
                values: [],
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <button
          // color={data.notNull ? 'primary' : 'info'}
          className={clsx(
            'p-2 !rounded cursor-pointer hover:shadow font-bold text-md w-9 h-9',
            data.notNull ? '!bg-blue-600 text-white' : '!bg-gray-200',
          )}
          // theme={data.notNull ? 'solid' : 'light'}
          onClick={() => {
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: 'field',
                tid: tid,
                fid: index,
                undo: { notNull: data.notNull },
                redo: { notNull: !data.notNull },
                message: t('edit_table', {
                  tableName: tables[tid].name,
                  extra: '[field]',
                }),
              },
            ]);
            setRedoStack([]);
            updateField(tid, index, { notNull: !data.notNull });
          }}
        >
          ?
        </button>
      </Grid>
      <Grid item xs={1.5}>
        <button
          // variant={data.primary ? 'text' : 'contained'}
          // theme={data.primary ? 'solid' : 'light'}
          className={clsx(
            'p-1 !rounded cursor-pointer hover:shadow w-9 h-9',
            data.primary ? '!bg-blue-600 text-white' : '!bg-gray-200',
          )}
          onClick={() => {
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: 'field',
                tid: tid,
                fid: index,
                undo: { primary: data.primary },
                redo: { primary: !data.primary },
                message: t('edit_table', {
                  tableName: tables[tid].name,
                  extra: '[field]',
                }),
              },
            ]);
            setRedoStack([]);
            updateField(tid, index, { primary: !data.primary });
          }}
          // startIcon={<Iconify icon="mdi:key-outline" />}
        >
          <Iconify icon="mdi:key-outline" />
        </button>
      </Grid>
      <Grid item xs={1.5}>
        <Popover
          buttonElement={
            <button className="p-1 !rounded cursor-pointer hover:shadow w-9 h-9 bg-gray-200">
              <Iconify icon="ic:round-more-vert" />
            </button>
          }
          // trigger="click"
          position="right"
          className="!w-[260px]"
          // showArrow
        >
          <div className="px-1 w-[240px] popover-theme">
            <FieldDetails data={data} index={index} tid={tid} />
          </div>
        </Popover>
      </Grid>
    </Grid>
  );
}
