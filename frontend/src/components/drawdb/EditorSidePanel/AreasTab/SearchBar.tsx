import { useEffect, useState } from "react";
import { useAreas } from "../../../hooks";
// import { AutoComplete } from "@douyinfe/semi-ui";
import { AutoComplete, TextField } from "@mui/material";
import { IconSearch } from "@douyinfe/semi-icons";
import { useTranslation } from "react-i18next";
import { Iconify } from "@components/common";

export default function SearchBar() {
  const { areas } = useAreas();
  const [searchText, setSearchText] = useState("");
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

  return (
    <AutoComplete
      options={filteredResult}
      inputValue={searchText}
      showClear
      renderInput={(props) => <TextField prefix={<Iconify icon="mdi:search"}/>} {...props} label={t("search")}/>}
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
