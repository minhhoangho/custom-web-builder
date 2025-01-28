import { useState } from 'react';
import { useNote } from 'src/containers/Editor/hooks';
import { Autocomplete } from '@components/common';

type NoteSearchBarProps = {
  setActiveKey: (activeKey: string) => void;
};

export default function SearchBar({ setActiveKey }: NoteSearchBarProps) {
  const { notes } = useNote();

  const [filteredResult, setFilteredResult] = useState(
    notes.map((t) => t.title),
  );

  const handleStringSearch = (value: string) => {
    setFilteredResult(
      notes.map((t) => t.title).filter((i) => i.includes(value)),
    );
  };

  return (
    <Autocomplete
      searchResult={filteredResult}
      onSearch={handleStringSearch}
      onSelect={(v) => {
        const res = notes.find((t) => t.title === v);
        if (!res) return;
        const id = res.id;
        setActiveKey(`${id}`);
        document
          .getElementById(`scroll_note_${id}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="w-full"
    />
  );
}
