import { useState } from "react";
// import { AutoComplete } from "@douyinfe/semi-ui";
// import { IconSearch } from "@douyinfe/semi-icons";
import { useSelect, useType } from "src/containers/Editor/hooks";
import { ObjectType } from "@constants/editor";
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@mui/material";

export default function Searchbar() {
  const { types } = useType();
  const [value, setValue] = useState("");
  // const { setSelectedElement } = useSelect();
  const { t } = useTranslation();

  const [filteredResult, setFilteredResult] = useState(
    types.map((t) => t.name),
  );

  const handleStringSearch = (value) => {
    setFilteredResult(
      types.map((t) => t.name).filter((i) => i.includes(value)),
    );
  };

  return (
    <Autocomplete
      options={filteredResult}
      value={value}
      showClear
      // prefix={<Iconify icon="mdi:search"}/>}
      // placeholder={t("search")}
      // emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
      onInputChange={(v) => setValue(v)}
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
