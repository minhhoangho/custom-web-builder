import { useEffect, useState } from 'react';
// import { AutoComplete } from "@douyinfe/semi-ui";
import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAreas } from 'src/containers/Editor/hooks';
import { Iconify } from '@components/common';

export default function SearchBar() {
  const { areas } = useAreas();
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();

  const [filteredResult, setFilteredResult] = useState(
    areas.map((t) => t.name),
  );

  const handleStringSearch = (value) => {
    setFilteredResult(
      areas.map((t) => t.name).filter((i) => i.includes(value)),
    );
  };
  // Implement useEffect to watch searchText and call handleStringSearch, use debouncing to prevent multiple calls
  useEffect(() => {
    const timer = setTimeout(() => {
      handleStringSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const renderInput = (props) => (
    <TextField
      prefix={<Iconify icon="mdi:search" />}
      {...props}
      label={t('search')}
    />
  );

  return (
    <Autocomplete
      options={filteredResult}
      inputValue={searchText}
      renderInput={renderInput}
      // prefix={<Iconify icon="mdi:search"}/>}
      // emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
      // onSearch={(v) => handleStringSearch(v)}
      onChange={(v) => setSearchText(v)}
      // onSelect={(v) => {
      //   const { id } = areas.find((t) => t.name === v);
      //   document
      //     .getElementById(`scroll_area_${id}`)
      //     .scrollIntoView({ behavior: "smooth" });
      // }}
      className="w-full"
    />
  );
}
