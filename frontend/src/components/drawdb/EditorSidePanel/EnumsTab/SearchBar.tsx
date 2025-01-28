import { useState } from 'react';
import { useEnum } from 'src/containers/Editor/hooks';
import { Autocomplete } from '@components/common';

export default function SearchBar() {
  const { enums } = useEnum();

  const [filteredResult, setFilteredResult] = useState<string[]>(
    enums.map((e) => e.name),
  );

  const handleStringSearch = (value: string) => {
    setFilteredResult(
      enums.map((e) => e.name).filter((i) => i.includes(value)),
    );
  };

  return (
    <Autocomplete
      searchResult={filteredResult}
      onSearch={handleStringSearch}
      onSelect={(v) => {
        const i = enums.findIndex((t) => t.name === v);
        document
          .getElementById(`scroll_enum_${i}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="w-full"
    />
  );
}
