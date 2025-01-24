import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Collapse, Iconify } from '@components/common';
import { ObjectType } from '@constants/editor';
import { useDiagram, useSelect } from 'src/containers/Editor/hooks';
import TableInfo from '@components/drawdb/EditorSidePanel/TablesTab/TableInfo';
import SearchBar from './SearchBar';
import Empty from '../Empty';
import { DTable } from '../../../../data/interface';

export default function TablesTab() {
  const { tables, addTable } = useDiagram();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();
  console.log('tables >> ', tables);

  return (
    <>
      <div className="flex gap-2 flex-col">
        <div className="my-2 mx-3">
          <Button
            startIcon={<Iconify icon="mdi:plus" />}
            variant="contained"
            className="rounded"
            // block
            onClick={() => addTable()}
          >
            {t('add_table')}
          </Button>
        </div>
        <SearchBar tables={tables} />
      </div>
      {tables.length === 0 ? (
        <Empty title={t('no_tables')} text={t('no_tables_text')} />
      ) : (
        <>
          {tables.map((_table: DTable) => (
            <Collapse
              key={_table.id}
              activeKey={
                selectedElement.open &&
                selectedElement.element === ObjectType.TABLE
                  ? `${selectedElement.id}`
                  : ''
              }
              // keepDOM
              // lazyRender
              onChange={(k) => {
                console.log('OK', k);
                setSelectedElement((prev) => ({
                  ...prev,
                  open: true,
                  id: parseInt(k),
                  element: ObjectType.TABLE,
                }));
              }}
              // accordion
            >
              <div id={`scroll_table_${_table.id}`} key={_table.id}>
                <Collapse.Panel
                  className="relative"
                  header={
                    <div>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {_table.name}
                      </div>
                      <div
                        className="w-1 h-full absolute top-0 left-0 bottom-0"
                        style={{ backgroundColor: _table.color }}
                      />
                    </div>
                  }
                  itemKey={`${_table.id}`}
                >
                  <TableInfo data={_table} />
                  {/*<div>Table ìno</div>*/}
                </Collapse.Panel>
              </div>
            </Collapse>
          ))}
        </>
      )}
    </>
  );
}
