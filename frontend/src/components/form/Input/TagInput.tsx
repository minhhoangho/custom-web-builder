import { Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRef, useState } from 'react';
import { Iconify } from '@components/common';

const Tags = ({ data, handleDelete }) => {
  return (
    <Box
      sx={{
        background: '#283240',
        height: '100%',
        display: 'flex',
        padding: '0.4rem',
        margin: '0 0.5rem 0 0',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#ffffff',
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography>{data}</Typography>
        <Iconify
          icon="material-symbols:cancel"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleDelete(data);
          }}
        />
      </Stack>
    </Box>
  );
};

type TagInputProps = {
  separator?: string;
  placeholder?: string;
  onInputChange?: (e?: any) => void;
  onFocus?: (e?: any) => void;
  onBlur?: (e?: any) => void;
  value?: string[];
  className?: string;
};

export function TagInput({
  placeholder,
  onInputChange,
  value,
  className,
  ...rest
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(value);
  const tagRef = useRef();

  const handleDelete = (value) => {
    const newtags = tags.filter((val) => val !== value);
    setTags(newtags);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setTags([...tags, tagRef.current.value]);
    tagRef.current.value = '';
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          inputRef={tagRef}
          fullWidth
          variant="standard"
          size="small"
          sx={{ margin: '1rem 0' }}
          className={className}
          margin="none"
          placeholder={placeholder}
          onChange={(e) => onInputChange?.(e.target.value)}
          {...rest}
          InputProps={{
            startAdornment: (
              <Box sx={{ margin: '0 0.2rem 0 0', display: 'flex' }}>
                {tags.map((data, index) => {
                  return (
                    <Tags data={data} handleDelete={handleDelete} key={index} />
                  );
                })}
              </Box>
            ),
          }}
        />
      </form>
    </Box>
  );
}
