import { useTranslation } from 'react-i18next';
import { Button, Skeleton } from '@mui/material';
import { useArea } from 'src/containers/Editor/hooks';
import { Iconify } from '@components/common';
import SearchBar from './SearchBar';
import AreaInfo from './AreaDetails';

export default function AreasTab() {
  const { areas, addArea } = useArea();
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex gap-2">
        <SearchBar />
        <div>
          <Button
            startIcon={<Iconify icon="mdi:plus" />}
            block
            onClick={() => addArea()}
          >
            {t('add_area')}
          </Button>
        </div>
      </div>
      {areas.length <= 0 ? (
        // <Empty
        //   title={t("no_subject_areas")}
        //   text={t("no_subject_areas_text")}
        // />
        <Skeleton animation={false} />
      ) : (
        <div className="p-2">
          {areas.map((a, i) => (
            <AreaInfo data={a} key={'area_' + i} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
