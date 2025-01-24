import { createContext, useState } from 'react';
import { toast } from '@components/common';
import { Action, DB, defaultBlue, ObjectType } from '@constants/editor';
import { DField, DRelationship, DTable } from 'src/data/interface';
import { useSelect, useTransform, useUndoRedo } from '../hooks';

export const DiagramContext = createContext<{
  tables: DTable[];
  setTables: (_tables: DTable[]) => void;
  addTable: (_data?: Partial<DTable> | null, addToHistory?: boolean) => void;
  updateTable: (_id: number, payload: Partial<DTable>) => void;
  updateField: (tid: number, fid: number, payload: Partial<DField>) => void;
  deleteField: (field: DField, tid: number, addToHistory?: boolean) => void;
  deleteTable: (id: number, addToHistory?: boolean) => void;
  relationships: DRelationship[];
  setRelationships: (_relationships: DRelationship[]) => void;
  addRelationship: (_data: DRelationship, addToHistory?: boolean) => void;
  deleteRelationship: (id: number, addToHistory?: boolean) => void;
  database: (typeof DB)[keyof typeof DB];
  setDatabase: (dbName: (typeof DB)[keyof typeof DB]) => void;
} | null>(null);

export default function DiagramContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [database, setDatabase] = useState<(typeof DB)[keyof typeof DB]>(
    DB.GENERIC,
  );
  const [tables, setTables] = useState<DTable[]>([]);
  const [relationships, setRelationships] = useState<DRelationship[]>([]);
  const { transform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();

  const addTable = (data?: Partial<DTable> | null, addToHistory = true) => {
    if (data?.id) {
      setTables((prev) => {
        const temp = prev.slice();
        temp.splice(Number(data.id), 0, data as DTable);
        return temp.map((t, i) => ({ ...t, id: i }));
      });
    } else {
      setTables((prev: DTable[]) => [
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
          message: 'Add table',
        },
      ]);
      setRedoStack([]);
    }
  };

  const deleteTable = (id: number, addToHistory = true) => {
    if (addToHistory) {
      toast('success', 'Table deleted');
      const rels = relationships.reduce(
        (acc: DRelationship[], r: DRelationship) => {
          if (r.startTableId === id || r.endTableId === id) {
            acc.push(r);
          }
          return acc;
        },
        [],
      );
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.TABLE,
          data: { table: tables[id], relationship: rels },
          message: `Delete table ${tables[id]?.name}`,
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

  const updateField = (
    tid: number,
    fid: number,
    updatedValues: Partial<DField>,
  ) => {
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

  const deleteField = (field: DField, tid: number, addToHistory = true) => {
    if (addToHistory) {
      const rels: DRelationship[] = relationships.reduce(
        (acc: DRelationship[], r: DRelationship) => {
          if (
            (r.startTableId === tid && r.startFieldId === field.id) ||
            (r.endTableId === tid && r.endFieldId === field.id)
          ) {
            acc.push(r);
          }
          return acc;
        },
        [],
      );
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
          message: `Delete field in table ${tables[tid]?.name}`,
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
      fields: tables[tid]?.fields
        .filter((e) => e.id !== field.id)
        .map((t, i) => {
          return { ...t, id: i };
        }),
    });
  };

  const addRelationship = (data: DRelationship, addToHistory = true) => {
    if (addToHistory) {
      setRelationships((prev) => {
        setUndoStack((prevUndo) => [
          ...prevUndo,
          {
            action: Action.ADD,
            element: ObjectType.RELATIONSHIP,
            data: data,
            message: 'Add relationship',
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

  const deleteRelationship = (id: number, addToHistory = true) => {
    if (addToHistory) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.DELETE,
          element: ObjectType.RELATIONSHIP,
          data: relationships[id],
          message: `Delete relationship ${relationships[id]?.name}`,
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
