import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHover } from 'usehooks-ts';
import { Button } from '@mui/material';
import { ColorPalette, Iconify } from '@components/common';
import { Action, defaultBlue, ObjectType, State, Tab } from '@constants/editor';
import {
  useArea,
  useCanvas,
  useLayout,
  useSaveState,
  useSelect,
  useSettings,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { Popover } from '@components/common/Popover';
import { Input } from '@components/form/Input';

export default function Area({
  data,
  onPointerDown,
  setResize,
  setInitCoords,
}) {
  const ref = useRef(null);
  const isHovered = useHover(ref);
  const {
    pointer: {
      spaces: { diagram: pointer },
    },
  } = useCanvas();
  const { layout } = useLayout();
  const { settings } = useSettings();
  const { setSaveState } = useSaveState();
  const { selectedElement, setSelectedElement } = useSelect();

  const handleResize = (e, dir) => {
    setResize({ id: data.id, dir: dir });
    setInitCoords({
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      pointerX: pointer.x,
      pointerY: pointer.y,
    });
  };

  const edit = () => {
    if (layout.sidebar) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.AREA,
        id: data.id,
        currentTab: Tab.AREAS,
        open: true,
      }));
      if (selectedElement.currentTab !== Tab.AREAS) return;
      document
        .getElementById(`scroll_area_${data.id}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.AREA,
        id: data.id,
        open: true,
      }));
    }
  };

  const onClickOutSide = () => {
    if (selectedElement.editFromToolbar) {
      setSelectedElement((prev) => ({
        ...prev,
        editFromToolbar: false,
      }));
      return;
    }
    setSelectedElement((prev) => ({
      ...prev,
      open: false,
    }));
    setSaveState(State.SAVING);
  };

  const areaIsSelected = () =>
    selectedElement.element === ObjectType.AREA &&
    selectedElement.id === data.id &&
    selectedElement.open;

  return (
    <g ref={ref}>
      <foreignObject
        key={data.id}
        x={data.x}
        y={data.y}
        width={data.width > 0 ? data.width : 0}
        height={data.height > 0 ? data.height : 0}
        onPointerDown={onPointerDown}
      >
        <div
          className={`border-2 ${
            isHovered
              ? 'border-dashed border-blue-500'
              : selectedElement.element === ObjectType.AREA &&
                  selectedElement.id === data.id
                ? 'border-blue-500'
                : 'border-slate-400'
          } w-full h-full cursor-move rounded`}
        >
          <div
            className="w-fill p-2 h-full"
            style={{ backgroundColor: `${data.color}66` }}
          >
            <div className="flex justify-between gap-1 w-full">
              <div className="text-color select-none overflow-hidden text-ellipsis">
                {data.name}
              </div>
              {(isHovered || (areaIsSelected() && !layout.sidebar)) && (
                <Popover
                  buttonElement={
                    <Button
                      startIcon={<Iconify icon="lucide:edit" />}
                      variant="contained"
                      style={{
                        backgroundColor: '#2F68ADB3',
                      }}
                      onClick={edit}
                    />
                  }
                  visible={areaIsSelected() && !layout.sidebar}
                  onClickOutSide={onClickOutSide}
                  // stopPropagation
                  // trigger="custom"
                  position="topRight"
                  // showArrow
                >
                  <EditPopoverContent data={data} />
                </Popover>
              )}
            </div>
          </div>
        </div>
      </foreignObject>
      {isHovered && (
        <>
          <circle
            cx={data.x}
            cy={data.y}
            r={6}
            fill={settings.mode === 'light' ? 'white' : 'rgb(28, 31, 35)'}
            stroke="#5891db"
            strokeWidth={2}
            cursor="nwse-resize"
            onPointerDown={(e) => e.isPrimary && handleResize(e, 'tl')}
          />
          <circle
            cx={data.x + data.width}
            cy={data.y}
            r={6}
            fill={settings.mode === 'light' ? 'white' : 'rgb(28, 31, 35)'}
            stroke="#5891db"
            strokeWidth={2}
            cursor="nesw-resize"
            onPointerDown={(e) => e.isPrimary && handleResize(e, 'tr')}
          />
          <circle
            cx={data.x}
            cy={data.y + data.height}
            r={6}
            fill={settings.mode === 'light' ? 'white' : 'rgb(28, 31, 35)'}
            stroke="#5891db"
            strokeWidth={2}
            cursor="nesw-resize"
            onPointerDown={(e) => e.isPrimary && handleResize(e, 'bl')}
          />
          <circle
            cx={data.x + data.width}
            cy={data.y + data.height}
            r={6}
            fill={settings.mode === 'light' ? 'white' : 'rgb(28, 31, 35)'}
            stroke="#5891db"
            strokeWidth={2}
            cursor="nwse-resize"
            onPointerDown={(e) => e.isPrimary && handleResize(e, 'br')}
          />
        </>
      )}
    </g>
  );
}

function EditPopoverContent({ data }) {
  const [editField, setEditField] = useState({});
  const { setSaveState } = useSaveState();
  const { updateArea, deleteArea } = useArea();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { t } = useTranslation();

  return (
    <div className="popover-theme">
      <div className="font-semibold mb-2 ml-1">{t('edit')}</div>
      <div className="w-[280px] flex items-center mb-2">
        <Input
          value={data.name}
          placeholder={t('name')}
          className="me-2"
          onInputChange={(value) => updateArea(data.id, { name: value })}
          onFocus={(e) => setEditField({ name: e.target.value })}
          onBlur={(e) => {
            if (e.target.value === editField.name) return;
            setUndoStack((prev) => [
              ...prev,
              {
                action: Action.EDIT,
                element: ObjectType.AREA,
                aid: data.id,
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
        <Popover
          buttonElement={
            <div
              className="h-[32px] w-[32px] rounded"
              style={{ backgroundColor: data.color }}
            />
          }
          position="topRight"
          // showArrow
        >
          <div className="popover-theme">
            <ColorPalette
              currentColor={data.color}
              onPickColor={(c: string) => {
                setUndoStack((prev) => [
                  ...prev,
                  {
                    action: Action.EDIT,
                    element: ObjectType.AREA,
                    aid: data.id,
                    undo: { color: data.color },
                    redo: { color: c },
                    message: t('edit_area', {
                      areaName: data.name,
                      extra: '[color]',
                    }),
                  },
                ]);
                setRedoStack([]);
                updateArea(data.id, {
                  color: c,
                });
              }}
              onClearColor={() => {
                updateArea(data.id, {
                  color: defaultBlue,
                });
                setSaveState(State.SAVING);
              }}
            />
          </div>
        </Popover>
      </div>
      <div className="flex">
        <Button
          startIcon={<Iconify icon="typcn:delete" />}
          color="error"
          onClick={() => deleteArea(data.id, true)}
        >
          {t('delete')}
        </Button>
      </div>
    </div>
  );
}
