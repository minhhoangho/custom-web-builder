import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import { Action, Cardinality, Constraint, ObjectType } from '@constants/editor';
import { useDiagram, useUndoRedo } from 'src/containers/Editor/hooks';
import i18n from 'src/i18n/i18n';
import { Iconify, Popover, SelectField as Select } from '@components/common';

const columns = [
  {
    headerName: i18n.t('primary'),
    field: 'primary',
  },
  {
    headerName: i18n.t('foreign'),
    field: 'foreign',
  },
];

export default function RelationshipInfo({ data }) {
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { tables, setRelationships, deleteRelationship } = useDiagram();
  const { t } = useTranslation();

  const swapKeys = () => {
    setUndoStack((prev) => [
      ...prev,
      {
        action: Action.EDIT,
        element: ObjectType.RELATIONSHIP,
        rid: data.id,
        undo: {
          startTableId: data.startTableId,
          startFieldId: data.startFieldId,
          endTableId: data.endTableId,
          endFieldId: data.endFieldId,
        },
        redo: {
          startTableId: data.endTableId,
          startFieldId: data.endFieldId,
          endTableId: data.startTableId,
          endFieldId: data.startFieldId,
        },
        message: t('edit_relationship', {
          refName: data.name,
          extra: '[swap keys]',
        }),
      },
    ]);
    setRedoStack([]);
    setRelationships((prev) =>
      prev.map((e, idx) =>
        idx === data.id
          ? {
              ...e,
              name: `${tables[e.startTableId].name}_${
                tables[e.startTableId].fields[e.startFieldId].name
              }_fk`,
              startTableId: e.endTableId,
              startFieldId: e.endFieldId,
              endTableId: e.startTableId,
              endFieldId: e.startFieldId,
            }
          : e,
      ),
    );
  };

  const changeCardinality = (value) => {
    setUndoStack((prev) => [
      ...prev,
      {
        action: Action.EDIT,
        element: ObjectType.RELATIONSHIP,
        rid: data.id,
        undo: { cardinality: data.cardinality },
        redo: { cardinality: value },
        message: t('edit_relationship', {
          refName: data.name,
          extra: '[cardinality]',
        }),
      },
    ]);
    setRedoStack([]);
    setRelationships((prev) =>
      prev.map((e, idx) =>
        idx === data.id ? { ...e, cardinality: value } : e,
      ),
    );
  };

  const changeConstraint = (key, value) => {
    const undoKey = `${key}Constraint`;
    setUndoStack((prev) => [
      ...prev,
      {
        action: Action.EDIT,
        element: ObjectType.RELATIONSHIP,
        rid: data.id,
        undo: { [undoKey]: data[undoKey] },
        redo: { [undoKey]: value },
        message: t('edit_relationship', {
          refName: data.name,
          extra: '[constraint]',
        }),
      },
    ]);
    setRedoStack([]);
    setRelationships((prev) =>
      prev.map((e, idx) => (idx === data.id ? { ...e, [undoKey]: value } : e)),
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="me-3">
          <span className="font-semibold">{t('primary')}: </span>
          {tables[data.endTableId].name}
        </div>
        <div className="mx-1">
          <span className="font-semibold">{t('foreign')}: </span>
          {tables[data.startTableId].name}
        </div>
        <div className="ms-1">
          <Popover
            buttonElement={
              <Button
                startIcon={<Iconify icon="ic:round-more-vert" />}
                variant="outlined"
                // type="tertiary"
              />
            }
            // content={}
            // trigger="click"
            position="topRight"
            // showArrow
          >
            <div className="p-2 popover-theme">
              <DataGrid
                columns={columns}
                rows={[
                  {
                    key: '1',
                    foreign: `${tables[data.startTableId]?.name}(${
                      tables[data.startTableId].fields[data.startFieldId]?.name
                    })`,
                    primary: `${tables[data.endTableId]?.name}(${
                      tables[data.endTableId].fields[data.endFieldId]?.name
                    })`,
                  },
                ]}
                // pagination={false}
                // size="small"
                // bordered
              />
              <div className="mt-2">
                <Button
                  // icon={<IconLoopTextStroked />}
                  startIcon={<Iconify icon="mdi:swap-horizontal" />}
                  // block
                  onClick={swapKeys}
                >
                  {t('swap')}
                </Button>
              </div>
            </div>
          </Popover>
        </div>
      </div>
      <div className="font-semibold my-1">{t('cardinality')}:</div>
      <Select
        options={Object.values(Cardinality).map((v) => ({
          label: t(v),
          value: v,
        }))}
        value={data.cardinality}
        className="w-full"
        onSelectChange={changeCardinality}
      />
      <Grid container spacing={6} className="my-3">
        <Grid item xs={6}>
          <div className="font-semibold">{t('on_update')}:</div>
          <Select
            options={Object.values(Constraint).map((v) => ({
              label: v,
              value: v,
            }))}
            value={data.updateConstraint}
            className="w-full"
            onSelectChange={(value) => changeConstraint('update', value)}
          />
        </Grid>
        <Grid item xs={6}>
          <div className="font-semibold">{t('on_delete')}:</div>
          <Select
            options={Object.values(Constraint).map((v) => ({
              label: v,
              value: v,
            }))}
            value={data.deleteConstraint}
            className="w-full"
            onSelectChange={(value) => changeConstraint('delete', value)}
          />
        </Grid>
      </Grid>
      <Button
        startIcon={<Iconify icon="mdi:delete-outline" />}
        // block
        color="error"
        onClick={() => deleteRelationship(data.id)}
      >
        {t('delete')}
      </Button>
    </>
  );
}
