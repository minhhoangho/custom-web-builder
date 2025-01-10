import { Collapse, Button } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { ObjectType } from '@constants/editor';
import { useSelect, useDiagram } from 'src/containers/Editor/hooks';
import SearchBar from './SearchBar';
import TableInfo from './TableInfo';
import Empty from '../Empty';

export default function TablesTab() {
  const { tables, addTable } = useDiagram();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-2">
        <SearchBar tables={tables} />
        <div>
          <Button
            startIcon={<Iconify icon="mdi:plus" />}
            block
            onClick={() => addTable()}
          >
            {t('add_table')}
          </Button>
        </div>
      </div>
      {tables.length === 0 ? (
        <Empty title={t('no_tables')} text={t('no_tables_text')} />
      ) : (
        <Collapse
          activeKey={
            selectedElement.open && selectedElement.element === ObjectType.TABLE
              ? `${selectedElement.id}`
              : ''
          }
          keepDOM
          lazyRender
          onChange={(k) =>
            setSelectedElement((prev) => ({
              ...prev,
              open: true,
              id: parseInt(k),
              element: ObjectType.TABLE,
            }))
          }
          accordion
        >
          {tables.map((t) => (
            <div id={`scroll_table_${t.id}`} key={t.id}>
              <Collapse.Panel
                className="relative"
                header={
                  <>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {t.name}
                    </div>
                    <div
                      className="w-1 h-full absolute top-0 left-0 bottom-0"
                      style={{ backgroundColor: t.color }}
                    />
                  </>
                }
                itemKey={`${t.id}`}
              >
                <TableInfo data={t} />
              </Collapse.Panel>
            </div>
          ))}
        </Collapse>
      )}
    </>
  );
}
