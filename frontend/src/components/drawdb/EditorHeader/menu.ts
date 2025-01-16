import { DB, MODAL, SIDESHEET, State } from "@constants/editor";
import { db } from "../../../data/db";
import { databases } from "../../../data/database";
import { toast } from "@components/common";
import {
  jsonToMariaDB,
  jsonToMySQL,
  jsonToPostgreSQL,
  jsonToSQLite,
  jsonToSQLServer
} from "../../../utils/exports/export-sql/generic";
import { exportSQL } from "../../../utils/exports/export-sql";
import { toJpeg, toPng, toSvg } from "html-to-image";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { jsonToMermaid } from "../../../utils/exports/export-as/mermaid";
import { jsonToDocumentation } from "../../../utils/exports/export-as/documentation";
import React from "react";

export const  const menu = {
  file: {
    new: {
      function: () => setModal(MODAL.NEW),
    },
    new_window: {
      function: () => {
        const newWindow = window.open('/editor', '_blank');
        newWindow.name = window.name;
      },
    },
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
            ...(databases[database]?.hasEnums && { enums: enums }),
            ...(databases[database]?.hasTypes && { types: types }),
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
            toPng(document.getElementById('canvas')).then(function (dataUrl) {
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
            toJpeg(document.getElementById('canvas'), { quality: 0.95 }).then(
              function (dataUrl) {
                setExportData((prev) => ({
                  ...prev,
                  data: dataUrl,
                  extension: 'jpeg',
                }));
              },
            );
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
                ...(databases[database].hasTypes && { types: types }),
                ...(databases[database].hasEnums && { enums: enums }),
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
            const filter = (node) => node.tagName !== 'i';
            toSvg(document.getElementById('canvas'), { filter: filter }).then(
              function (dataUrl) {
                setExportData((prev) => ({
                  ...prev,
                  data: dataUrl,
                  extension: 'svg',
                }));
              },
            );
            setModal(MODAL.IMG);
          },
        },
        {
          PDF: () => {
            const canvas = document.getElementById('canvas');
            toJpeg(canvas).then(function (dataUrl) {
              const doc = new jsPDF('l', 'px', [
                canvas.offsetWidth,
                canvas.offsetHeight,
              ]);
              doc.addImage(
                dataUrl,
                'jpeg',
                0,
                0,
                canvas.offsetWidth,
                canvas.offsetHeight,
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
                ...(databases[database].hasTypes && { types: types }),
                ...(databases[database].hasEnums && { enums: enums }),
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
              ...(databases[database].hasTypes && { types: types }),
              ...(databases[database].hasEnums && { enums: enums }),
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
        db.delete()
          .then(() => {
            toast('success', t('storage_flushed'));
            window.location.reload(false);
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
