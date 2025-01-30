import MenuItem from '@mui/material/MenuItem';
import { Box, InputLabel, Select } from '@mui/material';
import React from 'react';
import classNames from 'classnames';
import styles from './Select.module.scss';

export type OptionProps = {
  value: string | number;
  label: string;
};

export type SelectProps = {
  name?: string;
  options: OptionProps[];
  multiple?: boolean;
  label?: string;
  isRequired?: boolean;
  className?: string;
  selectElementClassName?: string;
  value?: string | string[] | number | number[];
  labelClassName?: string;
  onSelectChange?: (e?: any) => void;
  errorMessage?: string;
};

export const SelectField = ({
  label,
  name,
  onSelectChange,
  value,
  options,
  multiple = false,
  errorMessage,
  isRequired = false,
  labelClassName,
  className,
  selectElementClassName,
}: SelectProps) => {
  const labelNameId = `select_${name}_label`;
  const renderValue = (selected: string | number | string[] | number[]) => {
    if (multiple) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(selected as string[]).map((value) => (
            <div
              key={value}
              className="!h-7 rounded-full bg-gray-200 px-2 py-1"
            >
              {value}
            </div>
          ))}
        </Box>
      );
    }
    return selected;
  };
  return (
    <div className={classNames('relative w-full', className)}>
      <InputLabel
        id={labelNameId}
        className={classNames('text-sm', labelClassName)}
      >
        {label} {isRequired && <sup className="text-red-500 text-xs">*</sup>}
      </InputLabel>
      <Select
        size="small"
        variant="outlined"
        labelId={labelNameId}
        multiple={multiple}
        name={name}
        value={value}
        label={label}
        onChange={onSelectChange}
        renderValue={renderValue}
        className={classNames(
          'relative w-full !rounded',
          styles['select-input'],
          selectElementClassName,
        )}
      >
        {options.map((option: OptionProps) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errorMessage && (
        <span className="text-rose-500 text-xs">{errorMessage}</span>
      )}
    </div>
  );
};
