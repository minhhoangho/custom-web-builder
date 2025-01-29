import {
  Autocomplete as MuiAutocomplete,
  Paper,
  TextField,
} from '@mui/material';
import { HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react';
import { AutocompleteChangeReason } from '@mui/base';
import clsx from 'clsx';
import { TextFieldProps } from '@mui/material/TextField/TextField';
type AutocompleteProps = {
  onSearch: (value: string) => void;
  onSelect?: (value: any) => void;
  searchResult: any[];
  className?: string;
};

function ResultComponent(props: HTMLAttributes<HTMLElement>) {
  const { children } = props;
  return (
    <Paper
      className="mt-2"
      style={{
        boxShadow:
          'rgba(0, 0, 0, 0.3) 0px 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 4px 14px 0px',
      }}
    >
      {children}
    </Paper>
  );
}

export function Autocomplete({
  onSearch,
  onSelect,
  searchResult,
  className,
}: AutocompleteProps) {
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [onSearch, searchText]);

  const renderInput = (props: TextFieldProps) => (
    <TextField prefix="search" {...props} label="Search" size="small" />
  );

  const handleOnChange = (
    _e: SyntheticEvent,
    value: any,
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'selectOption') {
      onSelect?.(value);
    }
  };

  return (
    <MuiAutocomplete
      options={searchResult}
      value={searchText}
      renderInput={renderInput}
      onInputChange={(_e, v) => setSearchText(v)}
      PaperComponent={ResultComponent}
      onChange={handleOnChange}
      className={clsx('w-full', className)}
    />
  );
}
