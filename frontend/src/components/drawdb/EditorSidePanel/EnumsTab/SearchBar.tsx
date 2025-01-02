import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@mui/material';
import { useEnum } from 'src/containers/Editor/hooks';

export default function SearchBar() {
  const { enums } = useEnum();
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  const [filteredResult, setFilteredResult] = useState(
    enums.map((e) => e.name),
  );

  const handleStringSearch = (value) => {
    setFilteredResult(
      enums.map((e) => e.name).filter((i) => i.includes(value)),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleStringSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Autocomplete
      options={filteredResult}
      inputValue={value}
      // showClear
      // prefix={<Iconify icon="mdi:search-web"}/>}
      placeholder={t('search')}
      // emptyContent={<div className="p-3 popover-theme">{t('not_found')}</div>}
      onChange={(v) => setValue(v)}
      // onSelect={(v) => {
      //   const i = enums.findIndex((t) => t.name === v);
      //   document
      //     .getElementById(`scroll_enum_${i}`)
      //     .scrollIntoView({ behavior: 'smooth' });
      // }}
      className="w-full"
    />
  );
}
