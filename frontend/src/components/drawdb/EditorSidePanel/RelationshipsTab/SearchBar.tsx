import { useEffect, useState } from 'react';
// import { IconSearch } from "@douyinfe/semi-icons";
import { Autocomplete } from '@mui/material';
import { useDiagram } from 'src/containers/Editor/hooks';

export default function SearchBar() {
  const { relationships } = useDiagram();
  const [searchText, setSearchText] = useState('');
  // const { t } = useTranslation();

  const [filteredResult, setFilteredResult] = useState(
    relationships.map((t) => t.name),
  );

  const handleStringSearch = (value: string) => {
    setFilteredResult(
      relationships.map((t) => t.title).filter((i) => i.includes(value)),
    );
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleStringSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <Autocomplete
      options={filteredResult}
      value={searchText}
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
