import * as React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { db } from 'src/data/db';
import { CanvasContextProvider } from 'src/containers/Editor/context/CanvasContext';
import { DB, State } from '@constants/editor';
import {
  useArea,
  useDiagram,
  useEnum,
  useLayout,
  useNote,
  useSaveState,
  useSettings,
  useTasks,
  useTransform,
  useType,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { databases } from 'src/data/database';
import FloatingControls from './FloatingControls';
import SidePanel from './EditorSidePanel/SidePanel';
import Canvas from './EditorCanvas/Canvas';
import ControlPanel from './EditorHeader/ControlPanel';
import { DDiagram, DTemplate } from '../../data/interface';

export const IdContext = createContext<{
  gistId: string;
  setGistId: React.Dispatch<React.SetStateAction<string>>;
}>({
  gistId: '',
  setGistId: () => {},
});

// const useSearchParams = () => {
//   const router = useRouter();
//   // const [searchParams, setSearchParams] = useState(() => {
//   //   const params = new URLSearchParams(window?.location.search);
//   //   return Object.fromEntries(params.entries());
//   // });
//   const searchParams = useSearchParams();
//
//   const updateSearchParams = (newParams: AnyObject) => {
//     const updatedParams = new URLSearchParams(searchParams);
//     Object.entries(newParams).forEach(([key, value]) => {
//       if (value === undefined) {
//         updatedParams.delete(key);
//       } else {
//         updatedParams.set(key, value);
//       }
//     });
//     router.push(`?${updatedParams.toString()}`, undefined, { shallow: true });
//   };
//
//   useEffect(() => {
//     const handleRouteChange = () => {
//       const params = new URLSearchParams(window?.location.search);
//       setSearchParams(Object.fromEntries(params.entries()));
//     };
//
//     window.addEventListener('popstate', handleRouteChange);
//     return () => {
//       window.removeEventListener('popstate', handleRouteChange);
//     };
//   }, []);
//
//   return [searchParams, updateSearchParams];
// };

export default function WorkSpace() {
  const [id, setId] = useState(0);
  console.log('----------------------');
  console.log('id:', id);
  const [gistId, setGistId] = useState('');
  console.log('gistId:', gistId);
  const [loadedFromGistId, setLoadedFromGistId] = useState('');
  console.log('loadedFromGistId:', loadedFromGistId);
  const [title, setTitle] = useState<string>('Untitled Diagram');
  console.log('title:', title);
  const [resize, setResize] = useState(false);
  console.log('resize:', resize);
  const [width, setWidth] = useState(340);
  console.log('width:', width);
  const [lastSaved, setLastSaved] = useState('');
  console.log('lastSaved:', lastSaved);
  const [showSelectDbModal, setShowSelectDbModal] = useState(false);
  console.log('showSelectDbModal:', showSelectDbModal);
  const [selectedDb, setSelectedDb] = useState('');
  console.log('selectedDb:', selectedDb);
  const { layout } = useLayout();
  console.log('layout:', layout);
  const { settings } = useSettings();
  console.log('settings:', settings);
  const { types, setTypes } = useType();
  console.log('types:', types);
  const { areas, setAreas } = useArea();
  console.log('areas:', areas);
  const { tasks, setTasks } = useTasks();
  console.log('tasks:', tasks);
  const { notes, setNotes } = useNote();
  console.log('notes:', notes);
  const { saveState, setSaveState } = useSaveState();
  console.log('saveState:', saveState);
  const { transform, setTransform } = useTransform();
  console.log('transform:', transform);
  const { enums, setEnums } = useEnum();
  console.log('enums:', enums);

  const {
    tables,
    relationships,
    setTables,
    setRelationships,
    database,
    setDatabase,
  } = useDiagram();
  console.log('tables:', tables);
  console.log('relationships:', relationships);
  console.log('database:', database);
  const { undoStack, redoStack, setUndoStack, setRedoStack } = useUndoRedo();
  console.log('undoStack:', undoStack);
  console.log('redoStack:', redoStack);
  console.log('----------------------');
  // const { t, i18n } = useTranslation();

  // const [searchParams, setSearchParams] = useSearchParams();
  const searchParams = useSearchParams();
  const shareId = searchParams.get('shareId');

  const router = useRouter();
  const handleResize = (e: any) => {
    if (!resize) return;
    // const w = isRtl(i18n.language) ? window.innerWidth - e.clientX : e.clientX;
    const w = e.clientX;
    if (w > 340) setWidth(w);
  };

  const save = useCallback(async () => {
    if (saveState !== State.SAVING) return;

    const name = window.name.split(' ');
    const op = name[0];
    const saveAsDiagram = window.name === '' || op === 'd' || op === 'lt';

    if (saveAsDiagram) {
      // searchParams.delete('shareId');
      // setSearchParams(searchParams);
      router.replace({ search: null });
      if ((id === 0 && window.name === '') || op === 'lt') {
        await db.diagrams
          .add({
            database: database,
            name: title,
            gistId: gistId ?? '',
            lastModified: new Date(),
            tables: tables,
            references: relationships,
            notes: notes,
            areas: areas,
            todos: tasks,
            pan: transform.pan,
            zoom: transform.zoom,
            loadedFromGistId: loadedFromGistId,
            ...(databases[database]?.hasEnums && { enums: enums }),
            ...(databases[database]?.hasTypes && { types: types }),
          })
          .then((id) => {
            setId(id);
            window.name = `d ${id}`;
            setSaveState(State.SAVED);
            setLastSaved(new Date().toLocaleString());
          });
      } else {
        await db.diagrams
          .update(id, {
            database: database,
            name: title,
            lastModified: new Date(),
            tables: tables,
            references: relationships,
            notes: notes,
            areas: areas,
            todos: tasks,
            gistId: gistId ?? '',
            pan: transform.pan,
            zoom: transform.zoom,
            loadedFromGistId: loadedFromGistId,
            ...(databases[database]?.hasEnums && { enums: enums }),
            ...(databases[database]?.hasTypes && { types: types }),
          })
          .then(() => {
            setSaveState(State.SAVED);
            setLastSaved(new Date().toLocaleString());
          });
      }
    } else {
      await db.templates
        .update(id, {
          database: database,
          title: title,
          tables: tables,
          relationships: relationships,
          notes: notes,
          subjectAreas: areas,
          todos: tasks,
          pan: transform.pan,
          zoom: transform.zoom,
          ...(databases[database]?.hasEnums && { enums: enums }),
          ...(databases[database]?.hasTypes && { types: types }),
        })
        .then(() => {
          setSaveState(State.SAVED);
          setLastSaved(new Date().toLocaleString());
        })
        .catch(() => {
          setSaveState(State.ERROR);
        });
    }
  }, [
    searchParams,
    // setSearchParams,
    tables,
    relationships,
    notes,
    areas,
    types,
    title,
    id,
    tasks,
    transform,
    setSaveState,
    database,
    enums,
    gistId,
    loadedFromGistId,
    saveState,
  ]);

  const load = useCallback(async () => {
    const loadLatestDiagram = async () => {
      await db.diagrams
        .orderBy('lastModified')
        .last()
        .then((d: DDiagram) => {
          if (d) {
            if (d.database) {
              setDatabase(d.database);
            } else {
              setDatabase(DB.GENERIC);
            }
            setId(d.id);
            setGistId(d.gistId);
            setLoadedFromGistId(d.loadedFromGistId);
            setTitle(d.name);
            setTables(d.tables);
            setRelationships(d.references);
            setNotes(d.notes);
            setAreas(d.areas);
            setTasks(d.todos ?? []);
            setTransform({ pan: d.pan, zoom: d.zoom });
            if (databases[database]?.hasTypes) {
              setTypes(d.types ?? []);
            }
            if (databases[database]?.hasEnums) {
              setEnums(d.enums ?? []);
            }
            window.name = `d ${d.id}`;
          } else {
            window.name = '';
            if (selectedDb === '') setShowSelectDbModal(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const loadDiagram = async (id: number) => {
      await db.diagrams
        .get(id)
        .then((diagram) => {
          if (diagram) {
            if (diagram.database) {
              setDatabase(diagram.database);
            } else {
              setDatabase(DB.GENERIC);
            }
            setId(diagram.id);
            setGistId(diagram.gistId);
            setLoadedFromGistId(diagram.loadedFromGistId);
            setTitle(diagram.name);
            setTables(diagram.tables);
            setRelationships(diagram.references);
            setAreas(diagram.areas);
            setNotes(diagram.notes);
            setTasks(diagram.todos ?? []);
            setTransform({
              pan: diagram.pan,
              zoom: diagram.zoom,
            });
            setUndoStack([]);
            setRedoStack([]);
            if (databases[database].hasTypes) {
              setTypes(diagram.types ?? []);
            }
            if (databases[database].hasEnums) {
              setEnums(diagram.enums ?? []);
            }
            window.name = `d ${diagram.id}`;
          } else {
            window.name = '';
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const loadTemplate = async (id: number) => {
      await db.templates
        .get(id)
        .then((diagram: DTemplate) => {
          if (diagram) {
            if (diagram.database) {
              setDatabase(diagram.database);
            } else {
              setDatabase(DB.GENERIC);
            }
            setId(diagram.id);
            setTitle(diagram.title);
            setTables(diagram.tables);
            setRelationships(diagram.relationships);
            setAreas(diagram.subjectAreas);
            setTasks(diagram.todos ?? []);
            setNotes(diagram.notes);
            setTransform({
              zoom: 1,
              pan: { x: 0, y: 0 },
            });
            setUndoStack([]);
            setRedoStack([]);
            if (databases[database].hasTypes) {
              setTypes(diagram.types ?? []);
            }
            if (databases[database].hasEnums) {
              setEnums(diagram.enums ?? []);
            }
          } else {
            if (selectedDb === '') setShowSelectDbModal(true);
          }
        })
        .catch((error) => {
          console.log(error);
          if (selectedDb === '') setShowSelectDbModal(true);
        });
    };

    const loadFromGist = async (shareId: string) => {
      console.log('This function is not supported');
    };

    if (shareId) {
      const existingDiagram = await db.diagrams.get({
        loadedFromGistId: shareId,
      });

      if (existingDiagram) {
        window.name = 'd ' + existingDiagram.id;
        setId(existingDiagram.id);
      } else {
        window.name = '';
        setId(0);
      }
      await loadFromGist(shareId);
      return;
    }

    if (window.name === '') {
      await loadLatestDiagram();
    } else {
      const name = window.name.split(' ');
      const op = name[0];
      const id = parseInt(name?.[1] ?? '0');
      switch (op) {
        case 'd': {
          await loadDiagram(id);
          break;
        }
        case 't':
        case 'lt': {
          await loadTemplate(id);
          break;
        }
        default:
          break;
      }
    }
  }, [
    setTransform,
    setRedoStack,
    setUndoStack,
    setRelationships,
    setTables,
    setAreas,
    setNotes,
    setTypes,
    setTasks,
    setDatabase,
    database,
    setEnums,
    selectedDb,
    setSaveState,
    searchParams,
  ]);

  useEffect(() => {
    if (
      tables?.length === 0 &&
      areas?.length === 0 &&
      notes?.length === 0 &&
      types?.length === 0 &&
      tasks?.length === 0
    )
      return;

    if (settings.autosave) {
      setSaveState(State.SAVING);
    }
  }, [
    undoStack,
    redoStack,
    settings.autosave,
    tables?.length,
    areas?.length,
    notes?.length,
    types?.length,
    relationships?.length,
    tasks?.length,
    transform.zoom,
    title,
    gistId,
    setSaveState,
  ]);

  useEffect(() => {
    save();
  }, [saveState, save]);

  useEffect(() => {
    document.title = 'Editor | drawDB';

    load();
  }, [load]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden theme">
      <IdContext.Provider value={{ gistId, setGistId }}>
        <ControlPanel
          diagramId={id}
          setDiagramId={setId}
          title={title}
          setTitle={setTitle}
          lastSaved={lastSaved}
          // setLastSaved={setLastSaved}
        />
      </IdContext.Provider>
      <div
        className="flex h-full overflow-y-auto"
        onPointerUp={(e) => e.isPrimary && setResize(false)}
        onPointerLeave={(e) => e.isPrimary && setResize(false)}
        onPointerMove={(e) => e.isPrimary && handleResize(e)}
        onPointerDown={(e) => {
          // Required for onPointerLeave to trigger when a touch pointer leaves
          // https://stackoverflow.com/a/70976017/1137077
          e.target.releasePointerCapture(e.pointerId);
        }}
        // style={isRtl(i18n.language) ? { direction: 'rtl' } : {}}
      >
        {layout.sidebar && (
          <SidePanel resize={resize} setResize={setResize} width={width} />
        )}
        <div className="relative w-full h-full overflow-hidden">
          <CanvasContextProvider className="h-full w-full">
            <Canvas saveState={saveState} setSaveState={setSaveState} />
          </CanvasContextProvider>
          {!(layout.sidebar || layout.toolbar || layout.header) && (
            <div className="fixed right-5 bottom-4">
              <FloatingControls />
            </div>
          )}
        </div>
      </div>
      <Dialog
        fullWidth
        maxWidth="md"
        // centered
        // size="medium"
        // closable={false}
        // hasCancel={false}
        // title={t('pick_db')}
        // okText={t('confirm')}
        open={showSelectDbModal}
        // onOk={}
        // okButtonProps={{ disabled: selectedDb === '' }}
      >
        <DialogTitle>
          <div>Pick Database</div>
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-3 gap-4 place-content-center cursor-pointer">
            {Object.values(databases).map((x) => (
              <div
                key={x.name}
                onClick={() => setSelectedDb(x.label)}
                className={`space-y-3 py-3 px-4 rounded-md border-2 select-none ${
                  settings.mode === 'dark'
                    ? 'bg-zinc-700 hover:bg-zinc-600'
                    : 'bg-zinc-100 hover:bg-zinc-200'
                } ${selectedDb === x.label ? 'border-zinc-400 border-solid' : 'border-transparent'}`}
              >
                <div className="font-semibold">{x.name}</div>
                {x.image && (
                  <Image
                    src={x.image}
                    alt={x.label}
                    width={40}
                    height={40}
                    className="h-10"
                    style={{
                      filter:
                        'opacity(0.4) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white)',
                    }}
                  />
                )}
                <div className="text-xs">{x.description}</div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className="btn wd-140 btn-sm btn-outline-light"
            // type="submit"
            onClick={() => {
              if (selectedDb === '') return;
              setDatabase(selectedDb);
              setShowSelectDbModal(false);
            }}
            disabled={selectedDb === ''}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
