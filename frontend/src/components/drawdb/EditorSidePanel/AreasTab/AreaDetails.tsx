import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import {
  useArea,
  useSaveState,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { Action, defaultBlue, ObjectType, State } from '@constants/editor';
import { ColorPalette, Iconify, Popover } from '@components/common';
import { Input } from '@components/form/Input';
import { DArea } from 'src/data/interface';

export default function AreaInfo({ data, i }: { data: DArea; i: number }) {
  const { t } = useTranslation();
  const { setSaveState } = useSaveState();
  const { deleteArea, updateArea } = useArea();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState<{
    name: string;
  }>({
    name: '',
  });

  return (
    <Grid
      width="100%"
      container
      direction="row"
      spacing={1}
      alignItems="center"
      id={`scroll_area_${data.id}`}
      className="my-0"
    >
      <Grid item xs={9}>
        <Input
          value={data.name}
          placeholder={t('name')}
          onInputChange={(value) => updateArea(data.id, { name: value })}
          onFocus={(e) => setEditField({ name: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField.name) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.AREA,
                aid: i,
                undo: editField,
                redo: { name: e.target.value },
                message: t('edit_area', {
                  areaName: e.target.value,
                  extra: '[name]',
                }),
              },
            ]);
            setRedoStack([]);
          }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <div>
          <Popover
            buttonElement={
              <div
                className="h-[32px] w-[32px] rounded"
                style={{ backgroundColor: data.color }}
              />
            }
            position="bottomLeft"
          >
            <div className="popover-theme">
              <ColorPalette
                currentColor={data.color}
                onClearColor={() => {
                  updateArea(i, { color: defaultBlue });
                  setSaveState(State.SAVING);
                }}
                onPickColor={(c) => {
                  setUndoStack((prev) => [
                    ...prev,
                    {
                      action: Action.EDIT,
                      element: ObjectType.AREA,
                      aid: i,
                      undo: { color: data.color },
                      redo: { color: c },
                      message: t('edit_area', {
                        areaName: data.name,
                        extra: '[color]',
                      }),
                    },
                  ]);
                  setRedoStack([]);
                  updateArea(i, { color: c });
                }}
              />
            </div>
          </Popover>
        </div>
      </Grid>
      <Grid item xs={1.5} className="h-[36px]">
        <button
          className="!bg-gray-200 !text-red-500 !px-1.5 !rounded w-9 h-full cursor-pointer hover:shadow"
          color="error"
          onClick={() => deleteArea(i, true)}
        >
          <Iconify icon="mdi:delete-outline" />
        </button>
      </Grid>
    </Grid>
  );
}
