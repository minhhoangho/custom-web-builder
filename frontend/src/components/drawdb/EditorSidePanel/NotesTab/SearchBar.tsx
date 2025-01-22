import { useEffect, useState } from 'react';
// import { IconSearch } from "@douyinfe/semi-icons";
import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNote } from 'src/containers/Editor/hooks';
import { Iconify } from '@components/common';

export default function SearchBar({ setActiveKey }) {
  const { notes } = useNote();
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();

  const [filteredResult, setFilteredResult] = useState(
    notes.map((t) => t.title),
  );

  const handleStringSearch = (value) => {
    setFilteredResult(
      notes.map((t) => t.title).filter((i) => i.includes(value)),
    );
  };
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
      value={searchText}
      renderInput={renderInput}
      // showClear
      // prefix={<Iconify icon="mdi:search"}/>}
      // placeholder={t("search")}
      // emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
      onInputChange={(v) => setSearchText(v)}
      // onSelect={(v) => {
      //   const { id } = notes.find((t) => t.title === v);
      //   setActiveKey(`${id}`);
      //   document
      //     .getElementById(`scroll_note_${id}`)
      //     .scrollIntoView({ behavior: "smooth" });
      // }}
      className="w-full"
    />
  );
}
