import { useState } from 'react';
import { useDiagram, useSelect } from 'src/containers/Editor/hooks';
import { Autocomplete } from '@components/common';
import { ObjectType } from '@constants/editor';
import { EditorSelectInterface } from 'src/containers/Editor/interfaces';
import { DRelationship } from 'src/data/interface';

export default function SearchBar() {
  const { relationships } = useDiagram();
  const { setSelectedElement } = useSelect();

  const [filteredResult, setFilteredResult] = useState<string[]>([]);

  const handleStringSearch = (value: string) => {
    setFilteredResult(
      relationships
        .map((t: DRelationship) => t.name)
        .filter((i) => i.includes(value)),
    );
  };

  return (
    <Autocomplete
      searchResult={filteredResult}
      onSearch={handleStringSearch}
      onSelect={(v) => {
        const res = relationships.find((t: DRelationship) => t.name === v);
        if (!res) return;
        const id = res.id;
        setSelectedElement((prev: EditorSelectInterface) => ({
          ...prev,
          id: id,
          open: true,
          element: ObjectType.RELATIONSHIP,
        }));
        document
          .getElementById(`scroll_ref_${id}`)
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="w-full"
    />
  );
}
