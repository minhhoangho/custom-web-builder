import { useTranslation } from 'react-i18next';
import { Button, Collapse } from '@mui/material';
import { useEnum } from 'src/containers/Editor/hooks';
import { Iconify } from 'src/components/common';
import SearchBar from './SearchBar';
import EnumDetails from './EnumDetails';
import Empty from '../Empty';

export default function EnumsTab() {
  const { enums, addEnum } = useEnum();
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex gap-2">
        <SearchBar />
        <div>
          <Button
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => addEnum()}
          >
            {t('add_enum')}
          </Button>
        </div>
      </div>
      {enums.length <= 0 ? (
        <Empty title={t('no_enums')} text={t('no_enums_text')} />
      ) : (
        <Collapse accordion>
          {enums.map((e, i) => (
            <Collapse.Panel
              key={`enum_${i}`}
              id={`scroll_enum_${i}`}
              header={
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {e.name}
                </div>
              }
              itemKey={`${i}`}
            >
              <EnumDetails data={e} i={i} />
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
}
