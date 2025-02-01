import { useState } from 'react';
import { Button, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDiagram, useUndoRedo } from 'src/containers/Editor/hooks';
import { databases } from 'src/data/database';
import { dbToTypes } from 'src/data/datatypes';
import { Action, ObjectType } from '@constants/editor';
import { Iconify } from '@components/common';
import { Input, TagInput } from '@components/form/Input';
import { DField } from '../../../../data/interface';

export default function FieldDetails({
  data,
  tid,
  index,
}: {
  data: DField;
  tid: number;
  index: number;
}) {
  const { t } = useTranslation();
  const { tables, database } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { updateField, deleteField } = useDiagram();
  const [editField, setEditField] = useState<Partial<DField>>({});

  return (
    <div>
      <div className="font-semibold">{t('default_value')}</div>
      <Input
        className="my-2"
        placeholder={t('default_value')}
        value={data.default}
        disabled={dbToTypes[database][data.type].noDefault ?? data.increment}
        onInputChange={(value) => updateField(tid, index, { default: value })}
        onFocus={(e) => setEditField({ default: e.target.value })}
        onBlur={(e) => {
          if (e.target.value === editField.default) return;
          setUndoStack((prev) => [
            ...prev,
            {
              action: Action.EDIT,
              element: ObjectType.TABLE,
              component: 'field',
              tid: tid,
              fid: index,
              undo: editField,
              redo: { default: e.target.value },
              message: t('edit_table', {
                tableName: tables[tid]?.name,
                extra: '[field]',
              }),
              // message: t('edit_table'),
            },
          ]);
          setRedoStack([]);
        }}
      />
      {(data.type === 'ENUM' || data.type === 'SET') && (
        <>
          <div className="font-semibold mb-1">{data.type} Value</div>
          <TagInput
            separator={','}
            value={data.values}
            // validateStatus={
            //   !data.values || data.values.length === 0 ? 'error' : 'default'
            // }
            // addOnBlur
            className="my-2"
            placeholder={t('use_for_batch_input')}
            onInputChange={(v) => updateField(tid, index, { values: v })}
            onFocus={() => setEditField({ values: data.values })}
            onBlur={() => {
              if (
                JSON.stringify(editField.values) === JSON.stringify(data.values)
              )
                return;
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'field',
                  tid: tid,
                  fid: index,
                  undo: editField,
                  redo: { values: data.values },
                  message: t('edit_table'),
                  // message: t('edit_table', {
                  //   tableName: tables[tid].name,
                  //   extra: '[field]',
                  // }),
                },
              ]);
              setRedoStack([]);
            }}
          />
        </>
      )}
      {dbToTypes[database][data.type]?.isSized && (
        <>
          <div className="font-semibold">{t('size')}</div>
          <Input
            type="number"
            className="my-2 w-full"
            placeholder={t('size')}
            value={data.size as any}
            onInputChange={(value) =>
              updateField(tid, index, { size: Number(value) })
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
                  fid: index,
                  undo: editField,
                  redo: { size: e.target.value },
                  // message: t('edit_table'),
                  message: t('edit_table', {
                    tableName: tables[tid]?.name,
                    extra: '[field]',
                  }),
                },
              ]);
              setRedoStack([]);
            }}
          />
        </>
      )}
      {dbToTypes[database][data.type]?.hasPrecision && (
        <>
          <div className="font-semibold">{t('precision')}</div>
          <Input
            className="my-2 w-full"
            placeholder={t('set_precision')}
            // validateStatus={
            //   !data.size || /^\d+,\s*\d+$|^$/.test(data.size)
            //     ? 'default'
            //     : 'error'
            // }
            value={data.size}
            onInputChange={(value) =>
              updateField(tid, index, { size: Number(value) })
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
                  fid: index,
                  undo: editField,
                  redo: { size: e.target.value },
                  message: t('edit_table'),
                  // message: t('edit_table', {
                  //   tableName: tables[tid].name,
                  //   extra: '[field]',
                  // }),
                },
              ]);
              setRedoStack([]);
            }}
          />
        </>
      )}
      {dbToTypes[database][data.type]?.hasCheck && (
        <>
          <div className="font-semibold">{t('check')}</div>
          <Input
            className="mt-2"
            placeholder={t('check')}
            value={data.check}
            disabled={data.increment}
            onInputChange={(value) => updateField(tid, index, { check: value })}
            onFocus={(e) => setEditField({ check: e.target.value })}
            onBlur={(e) => {
              if (e.target.value === editField.check) return;
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'field',
                  tid: tid,
                  fid: index,
                  undo: editField,
                  redo: { check: e.target.value },
                  message: t('edit_table'),
                  // message: t('edit_table', {
                  //   tableName: tables[tid].name,
                  //   extra: '[field]',
                  // }),
                },
              ]);
              setRedoStack([]);
            }}
          />
          <div className="text-xs mt-1">{t('this_will_appear_as_is')}</div>
        </>
      )}
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
                component: 'field',
                tid: tid,
                fid: index,
                undo: {
                  [checkedValues.target.value]: !checkedValues.target.checked,
                },
                redo: {
                  [checkedValues.target.value]: checkedValues.target.checked,
                },
              },
            ]);
            setRedoStack([]);
            updateField(tid, index, {
              [checkedValues.target.value]: checkedValues.target.checked,
            });
          }}
        />
      </div>
      <div className="flex justify-between items-center my-3">
        <div className="font-medium">{t('autoincrement')}</div>
        <Checkbox
          value="increment"
          checked={data.increment}
          disabled={
            !dbToTypes[database][data.type].canIncrement || data.isArray
          }
          onChange={(checkedValues) => {
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: 'field',
                tid: tid,
                fid: index,
                undo: {
                  [checkedValues.target.value]: !checkedValues.target.checked,
                },
                redo: {
                  [checkedValues.target.value]: checkedValues.target.checked,
                },
                message: t('edit_table'),
                // message: t('edit_table', {
                //   tableName: tables[tid].name,
                //   extra: '[field]',
                // }),
              },
            ]);
            setRedoStack([]);
            updateField(tid, index, {
              increment: !data.increment,
              check: data.increment ? data.check : '',
            });
          }}
        />
      </div>
      {databases[database].hasArrays && (
        <div className="flex justify-between items-center my-3">
          <div className="font-medium">{t('declare_array')}</div>
          <Checkbox
            value="isArray"
            checked={data.isArray}
            onChange={(checkedValues) => {
              setUndoStack((prev) => [
                ...prev,
                {
                  action: Action.EDIT,
                  element: ObjectType.TABLE,
                  component: 'field',
                  tid: tid,
                  fid: index,
                  undo: {
                    [checkedValues.target.value]: !checkedValues.target.checked,
                  },
                  redo: {
                    [checkedValues.target.value]: checkedValues.target.checked,
                  },
                  message: t('edit_table'),
                  // message: t('edit_table', {
                  //   tableName: tables[tid].name,
                  //   extra: '[field]',
                  // }),
                },
              ]);
              setRedoStack([]);
              updateField(tid, index, {
                isArray: checkedValues.target.checked,
                increment: data.isArray ? data.increment : false,
              });
            }}
          />
        </div>
      )}
      {databases[database].hasUnsignedTypes &&
        dbToTypes[database][data.type].signed && (
          <div className="flex justify-between items-center my-3">
            <div className="font-medium">{t('Unsigned')}</div>
            <Checkbox
              value="unsigned"
              checked={data.unsigned}
              onChange={(checkedValues) => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.TABLE,
                    component: 'field',
                    tid: tid,
                    fid: index,
                    undo: {
                      [checkedValues.target.value]:
                        !checkedValues.target.checked,
                    },
                    redo: {
                      [checkedValues.target.value]:
                        checkedValues.target.checked,
                    },
                    message: t('edit_table'),
                    // message: t('edit_table', {
                    //   tableName: tables[tid].name,
                    //   extra: '[field]',
                    // }),
                  },
                ]);
                setRedoStack([]);
                updateField(tid, index, {
                  unsigned: checkedValues.target.checked,
                });
              }}
            />
          </div>
        )}
      <div className="font-semibold">{t('comment')}</div>
      <Input
        isTextarea
        className="my-2"
        placeholder={t('comment')}
        value={data.comment}
        // autosize
        onInputChange={(value) => updateField(tid, index, { comment: value })}
        onFocus={(e) => setEditField({ comment: e.target.value })}
        onBlur={(e) => {
          if (e.target.value === editField.comment) return;
          setUndoStack((prev) => [
            ...prev,
            {
              action: Action.EDIT,
              element: ObjectType.TABLE,
              component: 'field',
              tid: tid,
              fid: index,
              undo: editField,
              redo: { comment: e.target.value },
              message: t('edit_table'),
              // message: t('edit_table', {
              //   tableName: tables[tid].name,
              //   extra: '[field]',
              // }),
            },
          ]);
          setRedoStack([]);
        }}
      />
      <Button
        startIcon={<Iconify icon="mdi:delete-outline" />}
        variant="contained"
        color="error"
        // block
        onClick={() => deleteField(data, tid)}
        className="w-full"
      >
        {t('delete')}
      </Button>
    </div>
  );
}
