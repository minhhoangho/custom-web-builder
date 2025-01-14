import { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@components/common';
import { Action, DB, ObjectType, defaultBlue } from '@constants/editor';
import { useTransform, useUndoRedo, useSelect } from '../hooks';
import { DRelationship, DTable } from "../../../data/interface";

export const DiagramContext = createContext<{
  tables: DTable[];
  setTables: (_table: DTable[]) => void;
  addTable: (_data: DTable, addToHistory: boolean) => void;
  updateTable: (_id: number, payload: Partial<DTable>) => void;
  updateField: () => void;
  deleteField: () => void;
  deleteTable: () => void;
  relationships: any[];
  setRelationships: () => void;
  addRelationship: () => void;
  deleteRelationship: () => void;
  database: typeof DB[keyof typeof DB];
  setDatabase: (string) => void;
}>({
  tables: [],
  setTables: () => {
  },
  addTable: () => {
  },
  updateTable: () => {
  },
  updateField: () => {
  },
  deleteField: () => {
  },
  deleteTable: () => {
  },
  relationships: [],
  setRelationships: () => {
  },
  addRelationship: () => {
  },
  deleteRelationship: () => {
  },
  database: DB.GENERIC,
  setDatabase: () => {
  },
})

export default function DiagramContextProvider({ children }) {
  const { t } = useTranslation();
  const [database, setDatabase] = useState<typeof DB[keyof typeof DB]>(DB.GENERIC);
  const [tables, setTables] = useState<DTable[]>([]);
  const [relationships, setRelationships] = useState<DRelationship[]>([]);
  const { transform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();

  const addTable = (data: DTable, addToHistory = true) => {
    if (data) {
      setTables((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);
        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else {
      setTables((prev) => [
        ...prev,
        {
          id: prev.length,
          name: `table_${prev.length}`,
          x: transform.pan.x,
          y: transform.pan.y,
          fields: [
            {
              name: 'id',
              type: database === DB.GENERIC ? 'INT' : 'INTEGER',
              default: '',
              check: '',
              primary: true,
              unique: true,
              notNull: true,
              increment: true,
              comment: '',
              id: 0,
            },
          ],
          comment: '',
          indices: [],
          color: defaultBlue,
          key: Date.now(),
        },
      ]);
    }
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.ADD,
          element: ObjectType.TABLE,
          message: t('add_table'),
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteTable = (id, addToHistory = true) => {
    if (addToHistory) {
      toast('success', t('table_deleted'));
      const rels = relationships.reduce((acc, r) => {
        if (r.startTableId === id || r.endTableId === id) {
          acc.push(r);
        }
        return acc;
      }, []);
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.TABLE,
          data: { table: tables[id], relationship: rels },
          message: t('delete_table', { tableName: tables[id].name }),
        },
      ]);
      setRedoStack([]);
    }
    setRelationships((prevR) => {
      return prevR
        .filter((e) => !(e.startTableId === id || e.endTableId === id))
        .map((e, i) => {
          const newR = { ...e };

          if (e.startTableId > id) {
            newR.startTableId = e.startTableId - 1;
          }
          if (e.endTableId > id) {
            newR.endTableId = e.endTableId - 1;
          }

          return { ...newR, id: i };
        });
    });
    setTables((prev) => {
      return prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i }));
    });
    if (id === selectedElement.id) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.NONE,
        id: -1,
        open: false,
      }));
    }
  };

  const updateTable = (id: number, updatedValues: Partial<DTable>) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedValues } : t)),
    );
  };

  const updateField = (tid, fid, updatedValues) => {
    setTables((prev) =>
      prev.map((table, i) => {
        if (tid === i) {
          return {
            ...table,
            fields: table.fields.map((field, j) =>
              fid === j ? { ...field, ...updatedValues } : field,
            ),
          };
        }
        return table;
      }),
    );
  };

  const deleteField = (field, tid, addToHistory = true) => {
    if (addToHistory) {
      const rels = relationships.reduce((acc, r) => {
        if (
          (r.startTableId === tid && r.startFieldId === field.id) ||
          (r.endTableId === tid && r.endFieldId === field.id)
        ) {
          acc.push(r);
        }
        return acc;
      }, []);
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.EDIT,
          element: ObjectType.TABLE,
          component: 'field_delete',
          tid: tid,
          data: {
            field: field,
            relationship: rels,
          },
          message: t('edit_table', {
            tableName: tables[tid].name,
            extra: '[delete field]',
          }),
        },
      ]);
      setRedoStack([]);
    }
    setRelationships((prev) => {
      const temp = prev
        .filter(
          (e) =>
            !(
              (e.startTableId === tid && e.startFieldId === field.id) ||
              (e.endTableId === tid && e.endFieldId === field.id)
            ),
        )
        .map((e, i) => {
          if (e.startTableId === tid && e.startFieldId > field.id) {
            return {
              ...e,
              startFieldId: e.startFieldId - 1,
              id: i,
            };
          }
          if (e.endTableId === tid && e.endFieldId > field.id) {
            return {
              ...e,
              endFieldId: e.endFieldId - 1,
              id: i,
            };
          }
          return { ...e, id: i };
        });
      return temp;
    });
    updateTable(tid, {
      fields: tables[tid].fields
        .filter((e) => e.id !== field.id)
        .map((t, i) => {
          return { ...t, id: i };
        }),
    });
  };

  const addRelationship = (data, addToHistory = true) => {
    if (addToHistory) {
      setRelationships((prev) => {
        setUndoStack((prevUndo) => [
          ...prevUndo,
          {
            action: Action.ADD,
            element: ObjectType.RELATIONSHIP,
            data: data,
            message: t('add_relationship'),
          },
        ]);
        setRedoStack([]);
        return [...prev, data];
      });
    } else {
      setRelationships((prev) => {
        const temp = prev.slice();
        temp.splice(data.id, 0, data);
        return temp.map((t, i) => ({ ...t, id: i }));
      });
    }
  };

  const deleteRelationship = (id, addToHistory = true) => {
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.RELATIONSHIP,
          data: relationships[id],
          message: t('delete_relationship', {
            refName: relationships[id].name,
          }),
        },
      ]);
      setRedoStack([]);
    }
    setRelationships((prev) =>
      prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, id: i })),
    );
  };

  return (
    <DiagramContext.Provider
      value={{
        tables,
        setTables,
        addTable,
        updateTable,
        updateField,
        deleteField,
        deleteTable,
        relationships,
        setRelationships,
        addRelationship,
        deleteRelationship,
        database,
        setDatabase,
      }}
    >
      {children}
    </DiagramContext.Provider>
  );
}
