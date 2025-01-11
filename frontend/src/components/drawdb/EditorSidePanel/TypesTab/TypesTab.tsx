import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDiagram, useSelect, useType } from 'src/containers/Editor/hooks';
import { DB, ObjectType } from '@constants/editor';
import { Collapse, Iconify, Popover } from '@components/common';
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
            startIcon={<Iconify icon="mdi:plus" />}
            // block
            onClick={() => addType()}
          >
            {t('add_type')}
          </Button>
        </div>
        {database === DB.GENERIC && (
          <Popover
            buttonElement={
              <Button
                // theme="borderless"
                variant="outlined"
                startIcon={<Iconify icon="ci:info" />}
              />
            }
            // showArrow
            position="topRight"
          >
            <div className="w-[240px] text-sm space-y-2 popover-theme">
              {t('types_info')
                .split('\n')
                .map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
            </div>
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
          // keepDOM
          // lazyRender
          onChange={(id) =>
            setSelectedElement((prev) => ({
              ...prev,
              open: true,
              id: parseInt(id),
              element: ObjectType.TYPE,
            }))
          }
          // accordion
        >
          {types.map((t, i) => (
            <TypeInfo data={t} key={i} index={i} />
          ))}
        </Collapse>
      )}
    </>
  );
}
