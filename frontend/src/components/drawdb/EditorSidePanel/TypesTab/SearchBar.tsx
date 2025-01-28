import { useState } from 'react';
import { useSelect, useType } from 'src/containers/Editor/hooks';
import { Autocomplete } from '@components/common';
import { ObjectType } from '@constants/editor';

export default function Searchbar() {
  const { types } = useType();
  const { setSelectedElement } = useSelect();

  const [filteredResult, setFilteredResult] = useState(
    types.map((t) => t.name),
  );

  const handleStringSearch = (value: string) => {
    setFilteredResult(
      types.map((t) => t.name).filter((i) => i.includes(value)),
    );
  };

  return (
    <Autocomplete
      searchResult={filteredResult}
      onSearch={handleStringSearch}
      onSelect={(v) => {
        const i = types.findIndex((t) => t.name === v);
        setSelectedElement((prev) => ({
          ...prev,
          id: i,
          open: true,
          element: ObjectType.TYPE,
        }));
        document
          .getElementById(`scroll_type_${i}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="w-full"
    />
  );
}
