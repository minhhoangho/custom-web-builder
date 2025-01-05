import { Button, Collapse, Popover } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { useDiagram, useSelect, useType } from 'src/containers/Editor/hooks';
import { DB, ObjectType } from '@constants/editor';
import Searchbar from './SearchBar';
import TypeInfo from './TypeInfo';
import Empty from '../Empty';

export default function TypesTab() {
  const { types, addType } = useType();
  const { selectedElement, setSelectedElement } = useSelect();
  const { database } = useDiagram();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-2">
        <Searchbar />
        <div>
          <Button
            icon={<Iconify icon="mdi:plus" />}
            block
            onClick={() => addType()}
          >
            {t('add_type')}
          </Button>
        </div>
        {database === DB.GENERIC && (
          <Popover
            content={
              <div className="w-[240px] text-sm space-y-2 popover-theme">
                {t('types_info')
                  .split('\n')
                  .map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
              </div>
            }
            showArrow
            position="rightTop"
          >
            <Button theme="borderless" icon={<Iconify icon="ci:info" />} />
          </Popover>
        )}
      </div>
      {types.length <= 0 ? (
        <Empty title={t('no_types')} text={t('no_types_text')} />
      ) : (
        <Collapse
          activeKey={
            selectedElement.open && selectedElement.element === ObjectType.TYPE
              ? `${selectedElement.id}`
              : ''
          }
          keepDOM
          lazyRender
          onChange={(id) =>
            setSelectedElement((prev) => ({
              ...prev,
              open: true,
              id: parseInt(id),
              element: ObjectType.TYPE,
            }))
          }
          accordion
        >
          {types.map((t, i) => (
            <TypeInfo data={t} key={i} index={i} />
          ))}
        </Collapse>
      )}
    </>
  );
}
