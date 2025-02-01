import { Button, Dialog, DialogTitle } from '@mui/material';
import Image from 'next/image';
import * as React from 'react'; // import { isRtl } from '../../../i18n/utils/rtl';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Parser } from 'node-sql-parser';
import { useTranslation } from 'react-i18next';

import { getModalTitle, getOkText } from 'src/utils/model';
import { Input } from '@components/form/Input'; // import { isRtl } from '../../../i18n/utils/rtl';
import { DB, MODAL, STATUS } from '@constants/editor';
import {
  useArea,
  useDiagram,
  useEnum,
  useNote,
  useTasks,
  useTransform,
  useType,
  useUndoRedo,
} from 'src/containers/Editor/hooks';
import { db } from 'src/data/db';
import { importSQL } from 'src/utils/imports/import-sql';
import { databases } from 'src/data/database';
import { Spinner, toast } from '@components/common';
import { DBValueType, DTable, DTemplate } from 'src/data/interface';
import Rename from './Rename';
import Open from './Open';
import New from './New';
import ImportDiagram from './ImportDiagram';
import ImportSource from './ImportSource';
import SetTableWidth from './SetTableWidth';
import Code from './Code';

type ModalProps = {
  modal: (typeof MODAL)[keyof typeof MODAL];
  setModal: (modal: (typeof MODAL)[keyof typeof MODAL]) => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDiagramId: React.Dispatch<React.SetStateAction<number>>;
  exportData: {
    data: string | null;
    extension: 'json' | 'sql';
    filename: string;
  };
  setExportData: React.Dispatch<
    React.SetStateAction<{
      data: null | string;
      extension: 'json' | 'sql';
      filename: string;
    }>
  >;
  importDb: DBValueType;
};

export default function Modal({
  modal,
  setModal,
  title,
  setTitle,
  setDiagramId,
  exportData,
  setExportData,
  importDb,
}: ModalProps) {
  const { t } = useTranslation();
  const { setTables, setRelationships, database, setDatabase } = useDiagram();
  const { setNotes } = useNote();
  const { setAreas } = useArea();
  const { setTypes } = useType();
  const { setEnums } = useEnum();
  const { setTasks } = useTasks();
  const { setTransform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [uncontrolledTitle, setUncontrolledTitle] = useState<string>(title);
  const [importSource, setImportSource] = useState({
    src: '',
    overwrite: true,
  });
  const [importData, setImportData] = useState<DTemplate | null>(null);
  const [error, setError] = useState({
    type: STATUS.NONE,
    message: '',
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState(-1);
  const [selectedDiagramId, setSelectedDiagramId] = useState(0);
  const [saveAsTitle, setSaveAsTitle] = useState(title);

  const overwriteDiagram = () => {
    if (!importData) return;
    setTables(importData.tables);
    setRelationships(importData.relationships);
    setAreas(importData.subjectAreas);
    setNotes(importData.notes);
    if (importData.title) {
      setTitle(importData.title);
    }
    if (databases[database]?.hasEnums && importData.enums) {
      setEnums(importData.enums);
    }
    if (databases[database]?.hasTypes && importData.types) {
      setTypes(importData.types);
    }
  };

  const loadDiagram = async (id: number) => {
    await db.diagrams
      .get(id as never)
      .then((diagram) => {
        if (diagram) {
          if (diagram.database) {
            setDatabase(diagram.database);
          } else {
            setDatabase(DB.GENERIC);
          }
          setDiagramId(diagram.id ?? 0);
          setTitle(diagram.name ?? '');
          setTables(diagram.tables ?? []);
          setRelationships(diagram.references ?? []);
          setAreas(diagram.areas ?? []);
          setNotes(diagram.notes ?? []);
          setTasks(diagram.todos ?? []);
          setTransform({
            pan: diagram.pan as any,
            zoom: diagram.zoom as any,
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
          toast('error', 'Cannot find the diagram');
        }
      })
      .catch((_error) => {
        // console.log(error);
        toast('error', 'Cannot find the diagram');
      });
  };

  const parseSQLAndLoadDiagram = () => {
    const parser = new Parser();
    let ast = null;
    try {
      ast = parser.astify(importSource.src, {
        database: database === DB.GENERIC ? importDb : database,
      });
    } catch (error: any) {
      const message = error.location
        ? `${error.name} [Ln ${error.location.start.line}, Col ${error.location.start.column}]: ${error.message}`
        : error.message;

      setError({ type: STATUS.ERROR, message });
      return;
    }

    try {
      const diagramData = importSQL(
        ast,
        database === DB.GENERIC ? importDb : database,
        database,
      );

      if (importSource.overwrite) {
        setTables(diagramData.tables);
        setRelationships(diagramData.relationships);
        setTransform((prev) => ({ ...prev, pan: { x: 0, y: 0 } }));
        setNotes([]);
        setAreas([]);
        if (databases[database].hasTypes) setTypes(diagramData.types ?? []);
        if (databases[database].hasEnums) setEnums(diagramData.enums ?? []);
        setUndoStack([]);
        setRedoStack([]);
      } else {
        setTables((prev: DTable[]) =>
          [...prev, ...diagramData.tables].map((t, i) => ({ ...t, id: i })),
        );
        setRelationships((prev) =>
          [...prev, ...diagramData.relationships].map((r, i) => ({
            ...r,
            id: i,
          })),
        );
      }

      setModal(MODAL.NONE);
    } catch {
      setError({
        type: STATUS.ERROR,
        message: `Please check for syntax errors or let us know about the error.`,
      });
    }
  };

  const createNewDiagram = (id: number) => {
    const newWindow = window.open('/editor');
    if (!newWindow) return;
    newWindow.name = 'lt ' + id;
  };

  const getModalOnOk = () => {
    switch (modal) {
      case MODAL.IMG:
        saveAs(
          exportData.data ?? '',
          `${exportData.filename}.${exportData.extension}`,
        );
        return;
      case MODAL.CODE: {
        const blob = new Blob([exportData.data ?? ''], {
          type: 'application/json',
        });
        saveAs(blob, `${exportData.filename}.${exportData.extension}`);
        return;
      }
      case MODAL.IMPORT:
        if (error.type !== STATUS.ERROR) {
          setTransform((prev) => ({ ...prev, pan: { x: 0, y: 0 } }));
          overwriteDiagram();
          setImportData(null);
          setModal(MODAL.NONE);
          setUndoStack([]);
          setRedoStack([]);
        }
        return;
      case MODAL.IMPORT_SRC:
        parseSQLAndLoadDiagram();
        return;
      case MODAL.OPEN:
        if (selectedDiagramId === 0) return;
        loadDiagram(selectedDiagramId);
        setModal(MODAL.NONE);
        return;
      case MODAL.RENAME:
        setTitle(uncontrolledTitle);
        setModal(MODAL.NONE);
        return;
      case MODAL.SAVEAS:
        setTitle(saveAsTitle);
        setModal(MODAL.NONE);
        return;
      case MODAL.NEW:
        setModal(MODAL.NONE);
        createNewDiagram(selectedTemplateId);
        return;
      default:
        setModal(MODAL.NONE);
        return;
    }
  };

  const getModalBody = () => {
    switch (modal) {
      case MODAL.IMPORT:
        return (
          <ImportDiagram
            setImportData={setImportData}
            error={error}
            setError={setError}
          />
        );
      case MODAL.IMPORT_SRC:
        return (
          <ImportSource
            importData={importSource}
            setImportData={setImportSource}
            error={error}
            setError={setError}
          />
        );
      case MODAL.NEW:
        return (
          <New
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
          />
        );
      case MODAL.RENAME:
        return (
          <Rename key={title} title={title} setTitle={setUncontrolledTitle} />
        );
      case MODAL.OPEN:
        return (
          <Open
            selectedDiagramId={selectedDiagramId}
            setSelectedDiagramId={setSelectedDiagramId}
          />
        );
      case MODAL.SAVEAS:
        return (
          <Input
            placeholder={t('name')}
            value={saveAsTitle}
            onInputChange={(v) => setSaveAsTitle(v)}
          />
        );
      case MODAL.CODE:
      case MODAL.IMG:
        if (exportData.data !== '' || exportData.data) {
          return (
            <>
              {modal === MODAL.IMG ? (
                <Image src={exportData.data ?? ''} alt="Diagram" height={280} />
              ) : (
                <Code
                  value={exportData.data ?? ''}
                  language={exportData.extension}
                />
              )}
              <div className="text-sm font-semibold mt-2">{t('filename')}:</div>
              <Input
                value={exportData.filename}
                placeholder={t('filename')}
                label={`.${exportData.extension}`}
                onInputChange={(value) =>
                  setExportData((prev) => ({ ...prev, filename: value }))
                }
                name="filename"
              />
            </>
          );
        } else {
          return (
            <div className="text-center my-3 text-sky-600">
              {/*<Spin tip={t('loading')} size="large" />*/}
              <Spinner />
            </div>
          );
        }
      case MODAL.TABLE_WIDTH:
        return <SetTableWidth />;
      // case MODAL.LANGUAGE:
      //   return <Language />;
      // case MODAL.SHARE:
      //   return <Share title={title} setModal={setModal} />;
      default:
        return <></>;
    }
  };

  const getModelAction = () => {
    const isDisable =
      (error && error?.type === STATUS.ERROR) ||
      (modal === MODAL.IMPORT &&
        (error.type === STATUS.ERROR || !importData)) ||
      (modal === MODAL.RENAME && title === '') ||
      ((modal === MODAL.IMG || modal === MODAL.CODE) && !exportData.data) ||
      (modal === MODAL.SAVEAS && saveAsTitle === '') ||
      (modal === MODAL.IMPORT_SRC && importSource.src === '');

    return (
      <div className="flex space-x-4">
        {modal !== MODAL.SHARE && (
          <Button
            className="btn wd-140 btn-sm btn-outline-light "
            variant="outlined"
            // type="submit"
            disabled={isDisable}
            onClick={() => {
              if (modal === MODAL.RENAME) setUncontrolledTitle(title);
              setModal(MODAL.NONE);
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          className="btn wd-140 btn-sm btn-outline-light"
          variant="contained"
          // type="submit"
          disabled={isDisable}
          onClick={getModalOnOk}
        >
          {getOkText(modal)}
        </Button>
      </div>
    );
  };

  return (
    <Dialog
      fullScreen={false}
      maxWidth="md"
      fullWidth
      open={modal !== MODAL.NONE}
      aria-labelledby="modal-dialog-title"
      aria-describedby="modal-dialog-description"
      // onOk={getModalOnOk}
      onClose={() => {
        setExportData(() => ({
          data: '',
          extension: 'json',
          filename: `${title}_${new Date().toISOString()}`,
        }));
        setError({
          type: STATUS.NONE,
          message: '',
        });
        setImportData(null);
        setImportSource({
          src: '',
          overwrite: true,
        });
      }}
    >
      <div className="flex flex-col">
        <DialogTitle>{getModalTitle(modal)}</DialogTitle>
        <div className="modal-content mx-6">{getModalBody()}</div>
        <div className="modal-footer my-6 px-6 flex justify-end w-full">
          {getModelAction()}
        </div>
      </div>
    </Dialog>
  );
}
