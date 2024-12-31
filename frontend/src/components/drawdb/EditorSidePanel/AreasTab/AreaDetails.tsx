import { useState } from 'react';
// import { Row, Col, Button, Input, Popover } from "@douyinfe/semi-ui";
import { useTranslation } from 'react-i18next';
import { Button, Grid, Popover } from '@mui/material';
import {
  useArea,
  useSaveState,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { Action, defaultBlue, ObjectType, State } from '@constants/editor';
import { ColorPalette, Iconify } from '@components/common';
import { Input } from '@components/form/Input';

export default function AreaInfo({ data, i }) {
  const { t } = useTranslation();
  const { setSaveState } = useSaveState();
  const { deleteArea, updateArea } = useArea();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [editField, setEditField] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Grid
      container
      gutter={6}
      type="flex"
      justify="start"
      align="middle"
      id={`scroll_area_${data.id}`}
      className="my-3"
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
      <Grid item span={2}>
        <div>
          <div
            className="h-[32px] w-[32px] rounded"
            style={{ backgroundColor: data.color }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          />
          <Popover
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
      <Grid item span={1}>
        <Button
          startIcon={<Iconify icon="typcn:delete" />}
          color="error"
          onClick={() => deleteArea(i, true)}
        />
      </Grid>
    </Grid>
  );
}
