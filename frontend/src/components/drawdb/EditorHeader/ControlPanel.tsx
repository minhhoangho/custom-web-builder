import React, { MouseEvent, useState } from 'react';
import Image from 'next/image';
import { Button, Divider, Menu, MenuItem, Tooltip } from '@mui/material';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { useHotkeys } from 'react-hotkeys-hook';
import { Validator } from 'jsonschema';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import moment from 'moment';
import { Iconify, Spinner, toast } from '@components/common';
import { Input } from '@components/form/Input';
import { areaSchema, noteSchema, tableSchema } from 'src/data/drawdb-schema';
import { db } from 'src/data/db';
import {
  jsonToMariaDB,
  jsonToMySQL,
  jsonToPostgreSQL,
  jsonToSQLite,
  jsonToSQLServer,
} from 'src/utils/exports/export-sql/generic';
import {
  Action,
  DB,
  MODAL,
  ObjectType,
  SIDESHEET,
  State,
  Tab,
} from '@constants/editor';
import {
  useArea,
  useDiagram,
  useEnum,
  useLayout,
  useNote,
  useSaveState,
  useSelect,
  useSettings,
  useTransform,
  useType,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { dataURItoBlob } from 'src/utils/common';
import { exportSQL } from 'src/utils/exports/export-sql';
import { databases } from 'src/data/database';
import { jsonToMermaid } from 'src/utils/exports/export-as/mermaid';
import { jsonToDocumentation } from 'src/utils/exports/export-as/documentation';
import useConfirm from '@shared/hooks/use-confirm';
import {
  EditorLayoutInterface,
  EditorUndoStackInterface,
} from 'src/containers/Editor/interfaces';
import {
  DArea,
  DBValueType,
  DField,
  DNote,
  DRelationship,
  DTable,
} from 'src/data/interface';
import Modal from './Modal/Modal';
import Sidesheet from './SideSheet/Sidesheet';
import LayoutDropdown from './LayoutDropdown';
import { IconAddArea, IconAddNote, IconAddTable } from '../icons';

type BasicMenuProps = {
  prefix?: React.ReactNode | string;
  postfix?: React.ReactNode | string;
  title: string | React.ReactNode | HTMLElement;
  onMenuClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
};

function BasicMenu({
  prefix,
  postfix,
  title,
  onMenuClick,
  className,
  children,
}: BasicMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    onMenuClick?.(event);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className={clsx(
          'hover:bg-gray-200 rounded !justify-between !items-center w-full !text-neutral-900 bg-transparent !border-0 px-3 py-1 text-base !flex cursor-pointer',
          className,
        )}
      >
        {prefix}
        <>{title}</>
        {postfix}
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {children}
      </Menu>
    </div>
  );
}

type ControlPanelProps = {
  diagramId: number;
  setDiagramId: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  lastSaved: string;
};

type MenuConstType = {
  [key: string]: MenuItemConstType;
};
type MenuItemConstType = {
  function: () => void;
  warning?: {
    title: string;
    message: string;
  };
  shortcut?: string;
  state?: React.ReactElement;
  children?: { [key: string]: () => void }[];
};

export default function ControlPanel({
  diagramId,
  setDiagramId,
  title,
  setTitle,
  lastSaved,
}: ControlPanelProps) {
  const confirmBox = useConfirm();
  const [modal, setModal] = useState(MODAL.NONE);
  const [sidesheet, setSidesheet] = useState<0 | 1 | 2>(SIDESHEET.NONE);
  const [showEditName, setShowEditName] = useState(false);
  const [importDb, setImportDb] = useState<DBValueType>();
  const [exportData, setExportData] = useState<{
    data: null | string;
    extension: 'sql' | 'json' | 'png' | 'jpeg' | 'svg' | 'md';
    filename: string;
  }>({
    data: null,
    filename: `${title}_${new Date().toISOString()}`,
    extension: 'json',
  });
  const { saveState, setSaveState } = useSaveState();
  const { layout, setLayout } = useLayout();
  const { settings, setSettings } = useSettings();
  const {
    relationships,
    tables,
    setTables,
    addTable,
    updateTable,
    deleteField,
    deleteTable,
    updateField,
    setRelationships,
    addRelationship,
    deleteRelationship,
    database,
  } = useDiagram();
  const { enums, setEnums, deleteEnum, addEnum, updateEnum } = useEnum();
  const { types, addType, deleteType, updateType, setTypes } = useType();
  const { notes, setNotes, updateNote, addNote, deleteNote } = useNote();
  const { areas, setAreas, updateArea, addArea, deleteArea } = useArea();
  const { undoStack, redoStack, setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();
  const { transform, setTransform } = useTransform();
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const router = useRouter();

  const invertLayout = (component: keyof EditorLayoutInterface) =>
    setLayout((prev) => ({ ...prev, [component]: !prev[component] }));

  const undo = () => {
    if (undoStack.length === 0) return;
    const a: any = undoStack[undoStack.length - 1] as any;
    setUndoStack((prev) => prev.filter((_, i) => i !== prev.length - 1));
    if (a.action === Action.ADD) {
      if (a.element === ObjectType.TABLE) {
        deleteTable(tables[tables.length - 1]?.id as number, false);
      } else if (a.element === ObjectType.AREA) {
        deleteArea(areas[areas.length - 1]?.id as number, false);
      } else if (a.element === ObjectType.NOTE) {
        deleteNote(notes[notes.length - 1]?.id as number, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        deleteRelationship(a.data.id, false);
      } else if (a.element === ObjectType.TYPE) {
        deleteType(types.length - 1, false);
      } else if (a.element === ObjectType.ENUM) {
        deleteEnum(enums.length - 1, false);
      }
      setRedoStack((prev) => [...prev, a]);
    } else if (a.action === Action.MOVE) {
      if (a.element === ObjectType.TABLE) {
        setRedoStack((prev) => [
          ...prev,
          { ...a, x: tables[a.id ?? 0]?.x, y: tables[a.id ?? 0]?.y },
        ]);
        updateTable(a.id ?? 0, { x: a.x, y: a.y });
      } else if (a.element === ObjectType.AREA) {
        setRedoStack((prev) => [
          ...prev,
          { ...a, x: areas[a.id ?? 0]?.x, y: areas[a.id ?? 0]?.y },
        ]);
        updateArea(a.id ?? 0, { x: a.x, y: a.y });
      } else if (a.element === ObjectType.NOTE) {
        setRedoStack((prev) => [
          ...prev,
          { ...a, x: notes[a.id]?.x, y: notes[a.id]?.y },
        ]);
        updateNote(a.id ?? 0, { x: a.x, y: a.y });
      }
    } else if (a.action === Action.DELETE) {
      if (a.element === ObjectType.TABLE) {
        (a.data?.relationship as DRelationship[]).forEach((x: DRelationship) =>
          addRelationship(x, false),
        );
        addTable(a.data?.table as DTable, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        addRelationship(a.data as DRelationship, false);
      } else if (a.element === ObjectType.NOTE) {
        addNote(a.data as DNote, false);
      } else if (a.element === ObjectType.AREA) {
        addArea(a.data as DArea, false);
      } else if (a.element === ObjectType.TYPE) {
        addType({ id: a.id, ...a.data }, false);
      } else if (a.element === ObjectType.ENUM) {
        addEnum({ id: a.id, ...a.data }, false);
      }
      setRedoStack((prev) => [...prev, a]);
    } else if (a.action === Action.EDIT) {
      if (a.element === ObjectType.AREA) {
        updateArea(a.aid, a.undo);
      } else if (a.element === ObjectType.NOTE) {
        updateNote(a.nid, a.undo as DNote);
      } else if (a.element === ObjectType.TABLE) {
        if (a.component === 'field') {
          updateField(a.tid, a.fid, a.undo);
        } else if (a.component === 'field_delete') {
          setRelationships((prev) => {
            let temp = [...prev];
            a.data.relationship.forEach((r: DRelationship) => {
              temp.splice(r.id, 0, r);
            });
            temp = temp.map((e, i) => {
              const recoveredRel = a.data.relationship.find(
                (x: DRelationship) =>
                  (x.startTableId === e.startTableId &&
                    x.startFieldId === e.startFieldId) ||
                  (x.endTableId === e.endTableId &&
                    x.endFieldId === a.endFieldId),
              );
              if (
                e.startTableId === a.tid &&
                e.startFieldId >= a.data.field.id &&
                !recoveredRel
              ) {
                return {
                  ...e,
                  id: i,
                  startFieldId: e.startFieldId + 1,
                };
              }
              if (
                e.endTableId === a.tid &&
                e.endFieldId >= a.data.field.id &&
                !recoveredRel
              ) {
                return {
                  ...e,
                  id: i,
                  endFieldId: e.endFieldId + 1,
                };
              }
              return { ...e, id: i };
            });
            return temp;
          });
          setTables((prev) =>
            prev.map((t) => {
              if (t.id === a.tid) {
                const temp = t.fields.slice();
                temp.splice(a.data.field.id, 0, a.data.field);
                return { ...t, fields: temp.map((t, i) => ({ ...t, id: i })) };
              }
              return t;
            }),
          );
        } else if (a.component === 'field_add') {
          updateTable(a.tid, {
            fields: tables[a.tid]?.fields
              .filter((e) => e.id !== (tables[a.tid]?.fields?.length ?? 0) - 1)
              .map((t, i) => ({ ...t, id: i })),
          });
        } else if (a.component === 'index_add') {
          updateTable(a.tid, {
            indices: tables[a.tid]?.indices
              .filter((e) => e.id !== (tables[a.tid]?.indices?.length ?? 0) - 1)
              .map((t, i) => ({ ...t, id: i })),
          });
        } else if (a.component === 'index') {
          updateTable(a.tid, {
            indices: tables[a.tid]?.indices.map((index) =>
              index.id === a.iid
                ? {
                    ...index,
                    ...a.undo,
                  }
                : index,
            ),
          });
        } else if (a.component === 'index_delete') {
          setTables((prev) =>
            prev.map((table) => {
              if (table.id === a.tid) {
                const temp = table.indices.slice();
                temp.splice(a.data.id, 0, a.data);
                return {
                  ...table,
                  indices: temp.map((t, i) => ({ ...t, id: i })),
                };
              }
              return table;
            }),
          );
        } else if (a.component === 'self') {
          updateTable(a.tid, a.undo);
        }
      } else if (a.element === ObjectType.RELATIONSHIP) {
        setRelationships((prev) =>
          prev.map((e, idx) => (idx === a.rid ? { ...e, ...a.undo } : e)),
        );
      } else if (a.element === ObjectType.TYPE) {
        if (a.component === 'field_add') {
          updateType(a.tid, {
            fields: types[a.tid]?.fields.filter(
              (_, i) => i !== (types[a.tid]?.fields.length ?? 0) - 1,
            ),
          });
        }
        if (a.component === 'field') {
          updateType(a.tid, {
            fields: types[a.tid]?.fields.map((e, i) =>
              i === a.fid ? { ...e, ...a.undo } : e,
            ),
          });
        } else if (a.component === 'field_delete') {
          setTypes((prev) =>
            prev.map((t, i) => {
              if (i === a.tid) {
                const temp = t.fields.slice();
                temp.splice(a.fid, 0, a.data);
                return { ...t, fields: temp };
              }
              return t;
            }),
          );
        } else if (a.component === 'self') {
          updateType(a.tid, a.undo);
          if (a.updatedFields) {
            if (a.undo.name) {
              a.updatedFields.forEach((x: any) =>
                updateField(x.tid, x.fid, { type: a.undo.name.toUpperCase() }),
              );
            }
          }
        }
      } else if (a.element === ObjectType.ENUM) {
        updateEnum(a.id, a.undo);
        if (a.updatedFields) {
          if (a.undo.name) {
            a.updatedFields.forEach((x: any) =>
              updateField(x.tid, x.fid, { type: a.undo.name.toUpperCase() }),
            );
          }
        }
      }
      setRedoStack((prev) => [...prev, a]);
    } else if (a.action === Action.PAN) {
      setTransform((prev) => ({
        ...prev,
        pan: a.undo,
      }));
      setRedoStack((prev) => [...prev, a]);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const a: any = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.filter((_e, i) => i !== prev.length - 1));
    if (a.action === Action.ADD) {
      if (a.element === ObjectType.TABLE) {
        addTable(null, false);
      } else if (a.element === ObjectType.AREA) {
        addArea(null, false);
      } else if (a.element === ObjectType.NOTE) {
        addNote(null, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        addRelationship(a.data, false);
      } else if (a.element === ObjectType.TYPE) {
        addType(null, false);
      } else if (a.element === ObjectType.ENUM) {
        addEnum(null, false);
      }
      setUndoStack((prev) => [...prev, a]);
    } else if (a.action === Action.MOVE) {
      if (a.element === ObjectType.TABLE) {
        setUndoStack((prev) => [
          ...prev,
          { ...a, x: tables[a.id]?.x, y: tables[a.id]?.y },
        ]);
        updateTable(a.id, { x: a.x, y: a.y });
      } else if (a.element === ObjectType.AREA) {
        setUndoStack((prev) => [
          ...prev,
          { ...a, x: areas[a.id]?.x, y: areas[a.id]?.y },
        ]);
        updateArea(a.id, { x: a.x, y: a.y });
      } else if (a.element === ObjectType.NOTE) {
        setUndoStack((prev) => [
          ...prev,
          { ...a, x: notes[a.id]?.x, y: notes[a.id]?.y },
        ]);
        updateNote(a.id, { x: Number(a.x), y: Number(a.y) });
      }
    } else if (a.action === Action.DELETE) {
      if (a.element === ObjectType.TABLE) {
        deleteTable(a.data.table.id, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        deleteRelationship(a.data.id, false);
      } else if (a.element === ObjectType.NOTE) {
        deleteNote(a.data.id, false);
      } else if (a.element === ObjectType.AREA) {
        deleteArea(a.data.id, false);
      } else if (a.element === ObjectType.TYPE) {
        deleteType(a.id, false);
      } else if (a.element === ObjectType.ENUM) {
        deleteEnum(a.id, false);
      }
      setUndoStack((prev) => [...prev, a]);
    } else if (a.action === Action.EDIT) {
      if (a.element === ObjectType.AREA) {
        updateArea(a.aid, a.redo);
      } else if (a.element === ObjectType.NOTE) {
        updateNote(a.nid, a.redo);
      } else if (a.element === ObjectType.TABLE) {
        if (a.component === 'field') {
          updateField(a.tid, a.fid, a.redo);
        } else if (a.component === 'field_delete') {
          deleteField(a.data.field, a.tid, false);
        } else if (a.component === 'field_add') {
          updateTable(a.tid, {
            fields: [
              ...(tables[a.tid]?.fields ?? []),
              {
                name: '',
                type: 'INTEGER',
                default: '',
                check: '',
                primary: false,
                unique: false,
                notNull: false,
                increment: false,
                comment: '',
                id: tables[a.tid]?.fields.length ?? 0,
              } as DField,
            ],
          });
        } else if (a.component === 'index_add') {
          setTables((prev) =>
            prev.map((table) => {
              if (table.id === a.tid) {
                return {
                  ...table,
                  indices: [
                    ...table.indices,
                    {
                      id: table.indices.length,
                      name: `index_${table.indices.length}`,
                      fields: [],
                    },
                  ],
                };
              }
              return table;
            }),
          );
        } else if (a.component === 'index') {
          updateTable(a.tid, {
            indices: tables[a.tid]?.indices.map((index) =>
              index.id === a.iid
                ? {
                    ...index,
                    ...a.redo,
                  }
                : index,
            ),
          });
        } else if (a.component === 'index_delete') {
          updateTable(a.tid, {
            indices: tables[a.tid]?.indices
              .filter((e) => e.id !== a.data.id)
              .map((t, i) => ({ ...t, id: i })),
          });
        } else if (a.component === 'self') {
          updateTable(a.tid, a.redo);
        }
      } else if (a.element === ObjectType.RELATIONSHIP) {
        setRelationships((prev) =>
          prev.map((e, idx) => (idx === a.rid ? { ...e, ...a.redo } : e)),
        );
      } else if (a.element === ObjectType.TYPE) {
        if (a.component === 'field_add') {
          updateType(a.tid, {
            fields: [
              ...(types[a.tid]?.fields ?? []),
              {
                name: '',
                type: '',
              },
            ],
          });
        } else if (a.component === 'field') {
          updateType(a.tid, {
            fields: types[a.tid]?.fields.map((e, i) =>
              i === a.fid ? { ...e, ...a.redo } : e,
            ),
          });
        } else if (a.component === 'field_delete') {
          updateType(a.tid, {
            fields: types[a.tid]?.fields.filter((_field, i) => i !== a.fid),
          });
        } else if (a.component === 'self') {
          updateType(a.tid, a.redo);
          if (a.updatedFields) {
            if (a.redo.name) {
              a.updatedFields.forEach((x: any) =>
                updateField(x.tid, x.fid, { type: a.redo.name.toUpperCase() }),
              );
            }
          }
        }
      } else if (a.element === ObjectType.ENUM) {
        updateEnum(a.id, a.redo);
        if (a.updatedFields) {
          if (a.redo.name) {
            a.updatedFields.forEach((x: EditorUndoStackInterface) =>
              updateField(x.tid, x.fid, { type: a.redo.name.toUpperCase() }),
            );
          }
        }
      }
      setUndoStack((prev) => [...prev, a]);
    } else if (a.action === Action.PAN) {
      setTransform((prev) => ({
        ...prev,
        pan: a.redo,
      }));
      setUndoStack((prev) => [...prev, a]);
    }
  };

  const fileImport = () => setModal(MODAL.IMPORT);
  const viewGrid = () =>
    setSettings((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  const zoomIn = () =>
    setTransform((prev) => ({ ...prev, zoom: prev.zoom * 1.2 }));
  const zoomOut = () =>
    setTransform((prev) => ({ ...prev, zoom: prev.zoom / 1.2 }));
  const viewStrictMode = () => {
    setSettings((prev) => ({ ...prev, strictMode: !prev.strictMode }));
  };
  const viewFieldSummary = () => {
    setSettings((prev) => ({
      ...prev,
      showFieldSummary: !prev.showFieldSummary,
    }));
  };
  const copyAsImage = () => {
    toPng(document.getElementById('canvas') as HTMLElement).then((dataUrl) => {
      const blob = dataURItoBlob(dataUrl);
      navigator.clipboard
        .write([new ClipboardItem({ 'image/png': blob })])
        .then(() => {
          toast('success', t('copied_to_clipboard'));
        })
        .catch(() => {
          toast('error', 'Something went wrong');
        });
    });
  };
  const resetView = () =>
    setTransform((prev) => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }));
  const fitWindow = () => {
    const diagram: DOMRect | undefined = document
      .getElementById('diagram')
      ?.getBoundingClientRect();
    const canvas: DOMRect | undefined = document
      .getElementById('canvas')
      ?.getBoundingClientRect();
    if (!diagram || !canvas) return;
    const scaleX = canvas.width / diagram.width;
    const scaleY = canvas.height / diagram.height;
    const scale = Math.min(scaleX, scaleY);
    const translateX = canvas.left;
    const translateY = canvas.top;

    setTransform((prev) => ({
      ...prev,
      zoom: scale - 0.01,
      pan: { x: translateX, y: translateY },
    }));
  };
  const edit = () => {
    if (selectedElement.element === ObjectType.TABLE) {
      if (!layout.sidebar) {
        setSelectedElement((prev) => ({
          ...prev,
          open: true,
        }));
      } else {
        setSelectedElement((prev) => ({
          ...prev,
          open: true,
          currentTab: Tab.TABLES,
        }));
        if (selectedElement.currentTab !== Tab.TABLES) return;
        document
          .getElementById(`scroll_table_${selectedElement.id}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (selectedElement.element === ObjectType.AREA) {
      if (layout.sidebar) {
        setSelectedElement((prev) => ({
          ...prev,
          currentTab: Tab.AREAS,
        }));
        if (selectedElement.currentTab !== Tab.AREAS) return;
        document
          .getElementById(`scroll_area_${selectedElement.id}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setSelectedElement((prev) => ({
          ...prev,
          open: true,
          editFromToolbar: true,
        }));
      }
    } else if (selectedElement.element === ObjectType.NOTE) {
      if (layout.sidebar) {
        setSelectedElement((prev) => ({
          ...prev,
          currentTab: Tab.NOTES,
          open: false,
        }));
        if (selectedElement.currentTab !== Tab.NOTES) return;
        document
          .getElementById(`scroll_note_${selectedElement.id}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setSelectedElement((prev) => ({
          ...prev,
          open: true,
          editFromToolbar: true,
        }));
      }
    }
  };
  const del = () => {
    switch (selectedElement.element) {
      case ObjectType.TABLE:
        deleteTable(selectedElement.id);
        break;
      case ObjectType.NOTE:
        deleteNote(selectedElement.id);
        break;
      case ObjectType.AREA:
        deleteArea(selectedElement.id);
        break;
      default:
        break;
    }
  };
  const duplicate = () => {
    switch (selectedElement.element) {
      case ObjectType.TABLE:
        addTable({
          ...tables[selectedElement.id],
          x: (tables?.[selectedElement?.id]?.x ?? 0) + 20,
          y: (tables?.[selectedElement?.id]?.y ?? 0) + 20,
          id: tables.length,
        });
        break;
      case ObjectType.NOTE:
        addNote({
          ...notes[selectedElement.id],
          x: (notes[selectedElement.id]?.x ?? 0) + 20,
          y: (notes[selectedElement.id]?.y ?? 0) + 20,
          id: notes.length,
        });
        break;
      case ObjectType.AREA:
        addArea({
          ...areas[selectedElement.id],
          x: (areas[selectedElement.id]?.x ?? 0) + 20,
          y: (areas[selectedElement.id]?.y ?? 0) + 20,
          id: areas.length,
        });
        break;
      default:
        break;
    }
  };
  const copy = () => {
    switch (selectedElement.element) {
      case ObjectType.TABLE:
        navigator.clipboard
          .writeText(JSON.stringify({ ...tables[selectedElement.id] }))
          .catch(() => toast('error', 'Something went wrong'));
        break;
      case ObjectType.NOTE:
        navigator.clipboard
          .writeText(JSON.stringify({ ...notes[selectedElement.id] }))
          .catch(() => toast('error', 'Something went wrong'));
        break;
      case ObjectType.AREA:
        navigator.clipboard
          .writeText(JSON.stringify({ ...areas[selectedElement.id] }))
          .catch(() => toast('error', 'Something went wrong'));
        break;
      default:
        break;
    }
  };
  const paste = () => {
    navigator.clipboard.readText().then((text) => {
      let obj = null;
      try {
        obj = JSON.parse(text);
      } catch (error) {
        return;
      }
      const v = new Validator();
      if (v.validate(obj, tableSchema).valid) {
        addTable({
          ...obj,
          x: obj.x + 20,
          y: obj.y + 20,
          id: tables.length,
        });
      } else if (v.validate(obj, areaSchema).valid) {
        addArea({
          ...obj,
          x: obj.x + 20,
          y: obj.y + 20,
          id: areas.length,
        });
      } else if (v.validate(obj, noteSchema)) {
        addNote({
          ...obj,
          x: obj.x + 20,
          y: obj.y + 20,
          id: notes.length,
        });
      }
    });
  };
  const cut = () => {
    copy();
    del();
  };
  const save = () => setSaveState(State.SAVING);
  const open = () => setModal(MODAL.OPEN);
  const saveDiagramAs = () => setModal(MODAL.SAVEAS);
  // const fullscreen = useFullscreen();

  const menu: {
    [key: string]: MenuConstType;
  } = {
    file: {
      new: {
        function: () => setModal(MODAL.NEW),
      },
      // new_window: {
      //   function: () => {
      //     const newWindow = window.open('/editor', '_blank');
      //     if (!newWindow) return;
      //     newWindow.name = window.name;
      //   },
      // },
      open: {
        function: open,
        shortcut: 'Ctrl+O',
      },
      save: {
        function: save,
        shortcut: 'Ctrl+S',
      },
      save_as: {
        function: saveDiagramAs,
        shortcut: 'Ctrl+Shift+S',
      },
      save_as_template: {
        function: () => {
          db.templates
            .add({
              title: title,
              tables: tables,
              database: database,
              relationships: relationships,
              notes: notes,
              subjectAreas: areas,
              custom: 1,
              ...(databases?.[database]?.hasEnums && { enums: enums }),
              ...(databases?.[database]?.hasTypes && { types: types }),
            })
            .then(() => {
              toast('success', 'Template saved');
            });
        },
      },
      rename: {
        function: () => {
          setModal(MODAL.RENAME);
        },
      },
      delete_diagram: {
        warning: {
          title: t('delete_diagram'),
          message: t('are_you_sure_delete_diagram'),
        },
        function: async () => {
          await db.diagrams
            .delete(diagramId as never)
            .then(() => {
              setDiagramId(0);
              setTitle('Untitled diagram');
              setTables([]);
              setRelationships([]);
              setAreas([]);
              setNotes([]);
              setTypes([]);
              setEnums([]);
              setUndoStack([]);
              setRedoStack([]);
              setGistId('');
            })
            .catch(() => toast('error', 'Something went wrong'));
        },
      },
      import_diagram: {
        function: fileImport,
        shortcut: 'Ctrl+I',
      },
      import_from_source: {
        ...(database === DB.GENERIC && {
          children: [
            {
              MySQL: () => {
                setModal(MODAL.IMPORT_SRC);
                setImportDb(DB.MYSQL);
              },
            },
            {
              PostgreSQL: () => {
                setModal(MODAL.IMPORT_SRC);
                setImportDb(DB.POSTGRES);
              },
            },
            {
              SQLite: () => {
                setModal(MODAL.IMPORT_SRC);
                setImportDb(DB.SQLITE);
              },
            },
            {
              MariaDB: () => {
                setModal(MODAL.IMPORT_SRC);
                setImportDb(DB.MARIADB);
              },
            },
            {
              MSSQL: () => {
                setModal(MODAL.IMPORT_SRC);
                setImportDb(DB.MSSQL);
              },
            },
          ],
        }),
        function: () => {
          if (database === DB.GENERIC) return;

          setModal(MODAL.IMPORT_SRC);
        },
      },
      export_source: {
        ...(database === DB.GENERIC && {
          children: [
            {
              MySQL: () => {
                setModal(MODAL.CODE);
                const src = jsonToMySQL({
                  tables: tables,
                  references: relationships,
                  types: types,
                  database: database,
                });
                setExportData((prev) => ({
                  ...prev,
                  data: src,
                  extension: 'sql',
                }));
              },
            },
            {
              PostgreSQL: () => {
                setModal(MODAL.CODE);
                const src = jsonToPostgreSQL({
                  tables: tables,
                  references: relationships,
                  types: types,
                  database: database,
                });
                setExportData((prev) => ({
                  ...prev,
                  data: src,
                  extension: 'sql',
                }));
              },
            },
            {
              SQLite: () => {
                setModal(MODAL.CODE);
                const src = jsonToSQLite({
                  tables: tables,
                  references: relationships,
                  types: types,
                  database: database,
                });
                setExportData((prev) => ({
                  ...prev,
                  data: src,
                  extension: 'sql',
                }));
              },
            },
            {
              MariaDB: () => {
                setModal(MODAL.CODE);
                const src = jsonToMariaDB({
                  tables: tables,
                  references: relationships,
                  types: types,
                  database: database,
                });
                setExportData((prev) => ({
                  ...prev,
                  data: src,
                  extension: 'sql',
                }));
              },
            },
            {
              MSSQL: () => {
                setModal(MODAL.CODE);
                const src = jsonToSQLServer({
                  tables: tables,
                  references: relationships,
                  types: types,
                  database: database,
                });
                setExportData((prev) => ({
                  ...prev,
                  data: src,
                  extension: 'sql',
                }));
              },
            },
          ],
        }),
        function: () => {
          if (database === DB.GENERIC) return;
          setModal(MODAL.CODE);
          const src = exportSQL({
            tables: tables,
            references: relationships,
            types: types,
            database: database,
            enums: enums,
          });
          setExportData((prev) => ({
            ...prev,
            data: src,
            extension: 'sql',
          }));
        },
      },
      export_as: {
        children: [
          {
            PNG: () => {
              const canvas: HTMLElement | null =
                document.getElementById('canvas');
              if (!canvas) return;
              toPng(canvas).then(function (dataUrl) {
                setExportData((prev) => ({
                  ...prev,
                  data: dataUrl,
                  extension: 'png',
                }));
              });
              setModal(MODAL.IMG);
            },
          },
          {
            JPEG: () => {
              const canvas: HTMLElement | null =
                document.getElementById('canvas');
              if (!canvas) return;
              toJpeg(canvas, { quality: 0.95 }).then(function (dataUrl) {
                setExportData((prev) => ({
                  ...prev,
                  data: dataUrl,
                  extension: 'jpeg',
                }));
              });
              setModal(MODAL.IMG);
            },
          },
          {
            JSON: () => {
              setModal(MODAL.CODE);
              const result = JSON.stringify(
                {
                  tables: tables,
                  relationships: relationships,
                  notes: notes,
                  subjectAreas: areas,
                  database: database,
                  ...(databases?.[database]?.hasTypes && { types: types }),
                  ...(databases?.[database]?.hasEnums && { enums: enums }),
                  title: title,
                },
                null,
                2,
              );
              setExportData((prev) => ({
                ...prev,
                data: result,
                extension: 'json',
              }));
            },
          },
          {
            SVG: () => {
              const filter = (node: any) => node.tagName !== 'i';
              const canvas: HTMLElement | null =
                document.getElementById('canvas');
              if (!canvas) return;
              toSvg(canvas, { filter: filter }).then(function (dataUrl) {
                setExportData((prev) => ({
                  ...prev,
                  data: dataUrl,
                  extension: 'svg',
                }));
              });
              setModal(MODAL.IMG);
            },
          },
          {
            PDF: () => {
              const canvas: HTMLElement | null =
                document.getElementById('canvas');
              if (!canvas) return;
              toJpeg(canvas).then(function (dataUrl) {
                const doc = new jsPDF('l', 'px', [
                  canvas?.offsetWidth ?? 0,
                  canvas?.offsetHeight ?? 0,
                ]);
                if (!doc) return;
                doc.addImage(
                  dataUrl,
                  'jpeg',
                  0,
                  0,
                  canvas?.offsetWidth ?? 0,
                  canvas?.offsetHeight ?? 0,
                );
                doc.save(`${exportData.filename}.pdf`);
              });
            },
          },
          {
            DRAWDB: () => {
              const result = JSON.stringify(
                {
                  author: 'Unnamed',
                  title: title,
                  date: new Date().toISOString(),
                  tables: tables,
                  relationships: relationships,
                  notes: notes,
                  subjectAreas: areas,
                  database: database,
                  ...(databases?.[database]?.hasTypes && { types: types }),
                  ...(databases?.[database]?.hasEnums && { enums: enums }),
                },
                null,
                2,
              );
              const blob = new Blob([result], {
                type: 'text/plain;charset=utf-8',
              });
              saveAs(blob, `${exportData.filename}.ddb`);
            },
          },
          {
            MERMAID: () => {
              setModal(MODAL.CODE);
              const result = jsonToMermaid({
                tables: tables,
                relationships: relationships,
                notes: notes,
                subjectAreas: areas,
                database: database,
                title: title,
              });
              setExportData((prev) => ({
                ...prev,
                data: result,
                extension: 'md',
              }));
            },
          },
          {
            readme: () => {
              setModal(MODAL.CODE);
              const result = jsonToDocumentation({
                tables: tables,
                relationships: relationships,
                notes: notes,
                subjectAreas: areas,
                database: database,
                title: title,
                ...(databases?.[database]?.hasTypes && { types: types }),
                ...(databases?.[database]?.hasEnums && { enums: enums }),
              });
              setExportData((prev) => ({
                ...prev,
                data: result,
                extension: 'md',
              }));
            },
          },
        ],
        function: () => {},
      },
      exit: {
        function: () => {
          save();
          if (saveState === State.SAVED) router.replace('/');
        },
      },
    },
    edit: {
      undo: {
        function: undo,
        shortcut: 'Ctrl+Z',
      },
      redo: {
        function: redo,
        shortcut: 'Ctrl+Y',
      },
      clear: {
        warning: {
          title: t('clear'),
          message: t('are_you_sure_clear'),
        },
        function: () => {
          setTables([]);
          setRelationships([]);
          setAreas([]);
          setNotes([]);
          setEnums([]);
          setTypes([]);
          setUndoStack([]);
          setRedoStack([]);
        },
      },
      edit: {
        function: edit,
        shortcut: 'Ctrl+E',
      },
      cut: {
        function: cut,
        shortcut: 'Ctrl+X',
      },
      copy: {
        function: copy,
        shortcut: 'Ctrl+C',
      },
      paste: {
        function: paste,
        shortcut: 'Ctrl+V',
      },
      duplicate: {
        function: duplicate,
        shortcut: 'Ctrl+D',
      },
      delete: {
        function: del,
        shortcut: 'Del',
      },
      copy_as_image: {
        function: copyAsImage,
        shortcut: 'Ctrl+Alt+C',
      },
    },
    view: {
      header: {
        state: layout.header ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setLayout((prev) => ({ ...prev, header: !prev.header })),
      },
      sidebar: {
        state: layout.sidebar ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setLayout((prev) => ({ ...prev, sidebar: !prev.sidebar })),
      },
      issues: {
        state: layout.issues ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setLayout((prev) => ({ ...prev, issues: !prev.issues })),
      },
      strict_mode: {
        state: settings.strictMode ? (
          <i className="bi bi-toggle-off" />
        ) : (
          <i className="bi bi-toggle-on" />
        ),
        function: viewStrictMode,
        shortcut: 'Ctrl+Shift+M',
      },
      // presentation_mode: {
      //   function: () => {
      //     setLayout((prev) => ({
      //       ...prev,
      //       header: false,
      //       sidebar: false,
      //       toolbar: false,
      //     }));
      //     enterFullscreen();
      //   },
      // },
      field_details: {
        state: settings.showFieldSummary ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: viewFieldSummary,
        shortcut: 'Ctrl+Shift+F',
      },
      reset_view: {
        function: resetView,
        shortcut: 'Ctrl+R',
      },
      show_grid: {
        state: settings.showGrid ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: viewGrid,
        shortcut: 'Ctrl+Shift+G',
      },
      show_cardinality: {
        state: settings.showCardinality ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setSettings((prev) => ({
            ...prev,
            showCardinality: !prev.showCardinality,
          })),
      },
      show_debug_coordinates: {
        state: settings.showDebugCoordinates ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setSettings((prev) => ({
            ...prev,
            showDebugCoordinates: !prev.showDebugCoordinates,
          })),
      },
      theme: {
        children: [
          {
            light: () => {
              const body = document.body;
              if (body.hasAttribute('theme-mode')) {
                body.setAttribute('theme-mode', 'light');
              }
              localStorage.setItem('theme', 'light');
              setSettings((prev) => ({ ...prev, mode: 'light' }));
            },
          },
          {
            dark: () => {
              const body = document.body;
              if (body.hasAttribute('theme-mode')) {
                body.setAttribute('theme-mode', 'dark');
              }
              localStorage.setItem('theme', 'dark');
              setSettings((prev) => ({ ...prev, mode: 'dark' }));
            },
          },
        ],
        function: () => {},
      },
      zoom_in: {
        function: zoomIn,
        shortcut: 'Ctrl+(Up/Wheel)',
      },
      zoom_out: {
        function: zoomOut,
        shortcut: 'Ctrl+(Down/Wheel)',
      },
      // fullscreen: {
      //   state: fullscreen ? (
      //     <i className="bi bi-toggle-on" />
      //   ) : (
      //     <i className="bi bi-toggle-off" />
      //   ),
      //   function: fullscreen ? exitFullscreen : enterFullscreen,
      // },
    },
    settings: {
      show_timeline: {
        function: () => setSidesheet(SIDESHEET.TIMELINE),
      },
      autosave: {
        state: settings.autosave ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setSettings((prev) => ({ ...prev, autosave: !prev.autosave })),
      },
      panning: {
        state: settings.panning ? (
          <i className="bi bi-toggle-on" />
        ) : (
          <i className="bi bi-toggle-off" />
        ),
        function: () =>
          setSettings((prev) => ({ ...prev, panning: !prev.panning })),
      },
      table_width: {
        function: () => setModal(MODAL.TABLE_WIDTH),
      },
      language: {
        function: () => setModal(MODAL.LANGUAGE),
      },
      flush_storage: {
        warning: {
          title: t('flush_storage'),
          message: t('are_you_sure_flush_storage'),
        },
        function: async () => {
          await db
            .delete()
            .then(() => {
              toast('success', t('storage_flushed'));
              window.location.reload();
            })
            .catch(() => {
              toast('error', 'Something went wrong');
            });
        },
      },
    },
    help: {
      shortcuts: {
        function: () => window.open('/shortcuts', '_blank'),
        shortcut: 'Ctrl+H',
      },
      ask_on_discord: {
        function: () => window.open('https://discord.gg/BrjZgNrmR6', '_blank'),
      },
      report_bug: {
        function: () => window.open('/bug-report', '_blank'),
      },
      feedback: {
        function: () => window.open('/survey', '_blank'),
      },
    },
  };

  useHotkeys('ctrl+i, meta+i', fileImport, { preventDefault: true });
  useHotkeys('ctrl+z, meta+z', undo, { preventDefault: true });
  useHotkeys('ctrl+y, meta+y', redo, { preventDefault: true });
  useHotkeys('ctrl+s, meta+s', save, { preventDefault: true });
  useHotkeys('ctrl+o, meta+o', open, { preventDefault: true });
  useHotkeys('ctrl+e, meta+e', edit, { preventDefault: true });
  useHotkeys('ctrl+d, meta+d', duplicate, { preventDefault: true });
  useHotkeys('ctrl+c, meta+c', copy, { preventDefault: true });
  useHotkeys('ctrl+v, meta+v', paste, { preventDefault: true });
  useHotkeys('ctrl+x, meta+x', cut, { preventDefault: true });
  useHotkeys('delete', del, { preventDefault: true });
  useHotkeys('ctrl+shift+g, meta+shift+g', viewGrid, { preventDefault: true });
  useHotkeys('ctrl+up, meta+up', zoomIn, { preventDefault: true });
  useHotkeys('ctrl+down, meta+down', zoomOut, { preventDefault: true });
  useHotkeys('ctrl+shift+m, meta+shift+m', viewStrictMode, {
    preventDefault: true,
  });
  useHotkeys('ctrl+shift+f, meta+shift+f', viewFieldSummary, {
    preventDefault: true,
  });
  useHotkeys('ctrl+shift+s, meta+shift+s', saveDiagramAs, {
    preventDefault: true,
  });
  useHotkeys('ctrl+alt+c, meta+alt+c', copyAsImage, { preventDefault: true });
  useHotkeys('ctrl+r, meta+r', resetView, { preventDefault: true });
  useHotkeys('ctrl+h, meta+h', () => window.open('/shortcuts', '_blank'), {
    preventDefault: true,
  });
  useHotkeys('ctrl+alt+w, meta+alt+w', fitWindow, { preventDefault: true });

  return (
    <>
      <div>
        {layout.header && (
          <div className="flex justify-between items-center mr-7">
            {header()}
            {typeof window !== 'undefined' &&
              window.name.split(' ')[0] === 't' && (
                <Button
                  color="primary"
                  className="text-base me-2 pe-6 ps-5 py-[18px] rounded-md"
                  size="medium"
                  startIcon={<Iconify icon="mdi:share-outline" />}
                  onClick={() => setModal(MODAL.SHARE)}
                >
                  {t('share')}
                </Button>
              )}
          </div>
        )}
        {layout.toolbar && toolbar()}
      </div>
      <Modal
        modal={modal}
        exportData={exportData}
        setExportData={setExportData}
        title={title}
        setTitle={setTitle}
        setDiagramId={setDiagramId}
        setModal={setModal}
        importDb={importDb as DBValueType}
      />
      <Sidesheet
        type={sidesheet}
        onClose={() => setSidesheet(SIDESHEET.NONE)}
      />
    </>
  );

  function toolbar() {
    return (
      <div className="py-1.5 px-5 flex justify-between items-center rounded-xl my-1 sm:mx-1 xl:mx-6 select-none overflow-hidden bg-gray-200">
        <div className="flex justify-start items-center">
          <LayoutDropdown />
          <Divider orientation="vertical" flexItem />
          <BasicMenu
            title={
              <div className="py-1 px-1 mx-2 hover:bg-gray-300 rounded flex items-center justify-center">
                <div className="w-[40px]">
                  {Math.floor(transform.zoom * 100)}%
                </div>
                <div>
                  <Iconify icon="mdi:caret-down" />
                </div>
              </div>
            }
          >
            <MenuItem
              onClick={fitWindow}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div>{t('fit_window_reset')}</div>
              <div className="text-gray-400">Ctrl+Alt+W</div>
            </MenuItem>
            {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0].map((e, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  setTransform((prev) => ({ ...prev, zoom: e }));
                }}
              >
                {Math.floor(e * 100)}%
              </MenuItem>
            ))}
            <MenuItem>
              <Input
                type="number"
                name="zoom"
                label={t('zoom')}
                placeholder={t('zoom')}
                onInputChange={(v: number) =>
                  setTransform((prev) => ({
                    ...prev,
                    zoom: parseFloat(Number(v).toString()) * 0.01,
                  }))
                }
              />
            </MenuItem>
          </BasicMenu>
          <Tooltip title={t('zoom_in')} placement="bottom">
            <Iconify
              icon="mdi:zoom-in"
              width={32}
              height={32}
              className="p-1 mx-1 hover:bg-gray-300 rounded text-lg cursor-pointer"
              onClick={() =>
                setTransform((prev) => ({ ...prev, zoom: prev.zoom * 1.2 }))
              }
            />
          </Tooltip>
          <Tooltip title={t('zoom_out')} placement="bottom">
            <Iconify
              icon="mdi:zoom-out"
              width={32}
              height={32}
              className="p-1 mx-1 hover:bg-gray-300 rounded text-lg cursor-pointer"
              onClick={() =>
                setTransform((prev) => ({ ...prev, zoom: prev.zoom / 1.2 }))
              }
            />
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title={t('undo')} placement="bottom">
            <Iconify
              icon="mdi:undo"
              width={32}
              height={32}
              sx={{ color: undoStack.length === 0 ? '#9598a6' : '' }}
              className="p-1 mx-1 hover:bg-gray-300 rounded flex items-center cursor-pointer"
              onClick={undo}
            />
          </Tooltip>
          <Tooltip title={t('redo')} placement="bottom">
            <Iconify
              className="p-1 mx-1 hover:bg-gray-300 rounded flex items-center cursor-pointer"
              icon="mdi:redo"
              width={32}
              height={32}
              sx={{
                color: redoStack.length === 0 ? '#9598a6' : '',
              }}
              onClick={redo}
            />
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title={t('add_table')} placement="bottom">
            <button
              className="flex items-center p-1 mx-2 hover:bg-gray-300 rounded bg-gray-200 border-0 cursor-pointer"
              onClick={() => addTable()}
            >
              <IconAddTable />
            </button>
          </Tooltip>
          <Tooltip title={t('add_area')} placement="bottom">
            <button
              className="p-1 mx-2 hover:bg-gray-300 rounded flex items-center bg-gray-200 border-0 cursor-pointer"
              onClick={() => addArea()}
            >
              <IconAddArea />
            </button>
          </Tooltip>
          <Tooltip title={t('add_note')} placement="bottom">
            <button
              className="p-1 mx-2 hover:bg-gray-300 rounded flex items-center bg-gray-200 border-0 cursor-pointer"
              onClick={() => addNote()}
            >
              <IconAddNote />
            </button>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title={t('save')} placement="bottom">
            <button
              className="p-1 mx-2 hover:bg-gray-300 rounded flex items-center bg-gray-200 border-0 cursor-pointer"
              onClick={save}
            >
              <Iconify icon="mdi:content-save-outline" width={30} height={30} />
            </button>
          </Tooltip>
          <Tooltip title={t('to_do')} placement="bottom">
            <Iconify
              icon="mdi:calendar-check"
              width={36}
              height={36}
              className="p-1 mx-1 hover:bg-gray-300 rounded text-xl bg-gray-200  cursor-pointer"
              onClick={() => setSidesheet(SIDESHEET.TODO)}
            />
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title={t('theme')} placement="bottom">
            <Iconify
              icon="fluent:dark-theme-20-regular"
              width={32}
              height={32}
              className="p-1 mx-1 hover:bg-gray-300 rounded text-xl cursor-pointer"
              onClick={() => {
                const body = document.body;
                if (body.hasAttribute('theme-mode')) {
                  if (body.getAttribute('theme-mode') === 'light') {
                    menu['view']?.['theme']?.children?.[1]?.['dark']?.();
                  } else {
                    menu['view']?.['theme']?.children?.[0]?.['light']?.();
                  }
                }
              }}
            />
          </Tooltip>
        </div>
        <button
          onClick={() => invertLayout('header')}
          className="flex items-center bg-gray-200 border-0 cursor-pointer"
        >
          {layout.header ? (
            <Iconify icon="mdi:chevron-up" />
          ) : (
            <Iconify icon="mdi:chevron-down" />
          )}
        </button>
      </div>
    );
  }

  function getState() {
    switch (saveState) {
      case State.NONE:
        return t('no_changes');
      case State.LOADING:
        return t('loading');
      case State.SAVED:
        return `${t('last_saved')} ${lastSaved && moment(lastSaved).fromNow()}`;
      case State.SAVING:
        return t('saving');
      case State.ERROR:
        return t('failed_to_save');
      case State.FAILED_TO_LOAD:
        return t('failed_to_load');
      default:
        return '';
    }
  }

  function header() {
    const renderMenuHeader = (category: string, _index: number) => {
      const handleOnClickMenuItem = (menuItem: MenuItemConstType) => {
        if (menuItem.warning) {
          return confirmBox.confirm({
            title: menuItem.warning.title,
            message: menuItem.warning.message,
            confirmButtonLabel: t('confirm'),
          });
        }

        return menuItem.function();
      };

      return (
        <div key={_index}>
          <BasicMenu title={t(category)}>
            {Object.keys(menu[category] ?? {})?.map((item, index) => {
              if (menu[category]?.[item]?.children) {
                return (
                  <div key={_index}>
                    <BasicMenu
                      postfix={<Iconify icon="mdi:chevron-right" />}
                      title={t(item)}
                      className="!px-4 !py-1.5 round-0 !justify-between !items-center w-full !text-sm !text-neutral-900"
                    >
                      {menu[category]?.[item]?.children.map((e, i) => (
                        <MenuItem key={i} onClick={Object.values(e)[0]}>
                          <div>{Object.keys(e)?.[0] ?? ''}</div>
                        </MenuItem>
                      ))}
                    </BasicMenu>
                  </div>
                );
              }
              return (
                <MenuItem
                  key={index}
                  // onClick={menu[category][item].function}
                  onClick={() => {
                    if (menu?.[category]?.[item]) {
                      handleOnClickMenuItem(menu[category][item]);
                    }
                  }}
                  sx={
                    menu[category]?.[item]?.shortcut &&
                    ({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    } as any)
                  }
                  className="w-[280px]"
                >
                  <div className="w-full flex items-center justify-between">
                    <div>{t(item)}</div>
                    <div className="flex items-center gap-1">
                      {menu[category]?.[item]?.shortcut && (
                        <div className="text-gray-400">
                          {menu[category][item].shortcut}
                        </div>
                      )}
                      {menu[category]?.[item]?.state &&
                        menu[category][item].state}
                    </div>
                  </div>
                </MenuItem>
              );
            })}
          </BasicMenu>
        </div>
      );
    };

    return (
      <nav className="flex justify-between pt-1 items-center whitespace-nowrap">
        <div className="flex justify-start items-center">
          <Link href="/">
            <Image
              width={54}
              height={54}
              src="/static/images/database/icon_dark_64.png"
              alt="logo"
              className="ml-7 min-w-[54px]"
            />
          </Link>
          <div className="ml-1 mt-1">
            <div className="flex items-center ml-3 gap-2">
              {databases[database]?.image && (
                <Image
                  src={databases[database]?.image ?? ''}
                  width={20}
                  height={20}
                  // className="h-5"
                  style={{
                    filter:
                      'opacity(0.4) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white)',
                  }}
                  alt={databases[database].name + ' icon'}
                  title={databases[database].name + ' diagram'}
                />
              )}
              <div
                className="text-xl  me-1"
                onPointerEnter={(e) => e.isPrimary && setShowEditName(true)}
                onPointerLeave={(e) => e.isPrimary && setShowEditName(false)}
                onPointerDown={(e) => {
                  // Required for onPointerLeave to trigger when a touch pointer leaves
                  // https://stackoverflow.com/a/70976017/1137077
                  (e.target as any)?.releasePointerCapture(e.pointerId);
                }}
                onClick={() => setModal(MODAL.RENAME)}
              >
                {/*{window.name.split(' ')[0] === 't' ? 'Templates/' : 'Diagrams/'}*/}
                {typeof window !== 'undefined' &&
                window.name.split(' ')[0] === 't'
                  ? 'Templates/'
                  : 'Diagrams/'}
                {title}
              </div>
              {(showEditName || modal === MODAL.RENAME) && (
                <Iconify icon="lucide:edit" />
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex justify-start text-md select-none me-2">
                {Object.keys(menu).map((category, _index) =>
                  renderMenuHeader(category, _index),
                )}
              </div>
              <Button size="small" color="primary" variant="outlined">
                {saveState === State.LOADING || saveState === State.SAVING ? (
                  <Spinner className="!w-3 !h-3 !mr-3" />
                ) : null}
                {getState()}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
