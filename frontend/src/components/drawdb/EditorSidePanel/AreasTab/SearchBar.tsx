import { useState } from 'react';
import { useArea } from 'src/containers/Editor/hooks';
import { Autocomplete } from '@components/common';

export default function SearchBar() {
  const { areas } = useArea();

  const [filteredResult, setFilteredResult] = useState<string[]>(
    areas.map((t) => t.name),
  );

  const handleStringSearch = (value: string) => {
    setFilteredResult(
      areas.map((t) => t.name).filter((i) => i.includes(value)),
    );
  };

  return (
    <Autocomplete
      searchResult={filteredResult}
      onSearch={handleStringSearch}
      onSelect={(v) => {
        const res = areas.find((t) => t.name === v);
        if (!res) return;
        const id = res.id;
        document
          .getElementById(`scroll_area_${id}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="w-full"
    />
  );
}
