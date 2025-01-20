import React from 'react';
import classNames from 'classnames';

export type InputProps = {
  label?: string;
  name?: string;
  type?: string;
  placeholder: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
  inputElementClassName?: string;
  value?: string;
  labelClassName?: string;
  onInputChange?: (e?: any) => void;
  onFocus?: (e?: any) => void;
  onBlur?: (e?: any) => void;
  errorMessage?: string;
  isTextarea?: boolean;
  autoComplete?: string;
};

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      label,
      name,
      placeholder,
      isRequired,
      className,
      inputElementClassName,
      value,
      labelClassName,
      onInputChange,
      errorMessage,
      isTextarea,
      autoComplete,
      ...rest
    }: InputProps &
      React.TextareaHTMLAttributes<HTMLTextAreaElement> &
      React.InputHTMLAttributes<HTMLInputElement>,
    ref,
  ): React.ReactElement => (
    <div className={classNames('relative w-full ', className)}>
      {label && (
        <label
          className={classNames('block text-sm mb-1', labelClassName)}
          htmlFor={name}
        >
          {label} {isRequired && <sup className="text-red-500 text-xs">*</sup>}
        </label>
      )}
      {isTextarea ? (
        <textarea
          {...rest}
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          style={{ border: '1px solid #e0e0e0' }}
          className={classNames(
            'border-1 px-3 py-3 placeholder-blueGray-300 rounded-xl text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150',
            inputElementClassName,
          )}
          autoComplete={autoComplete}
          value={value ?? ''}
          onChange={(event) => onInputChange?.(event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div className="position-relative w-full">
          <input
            {...rest}
            ref={ref as React.RefObject<HTMLInputElement>}
            // style={{ border: '1px solid #e0e0e0' }}
            className={classNames(
              // 'border-1 px-3 py-3 placeholder-blueGray-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring focus:border-0 w-full ease-linear transition-all duration-150',
              'w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 shadow-sm focus:shadow',
              inputElementClassName,
            )}
            autoComplete={autoComplete}
            value={value ?? ''}
            onChange={(event) => onInputChange?.(event.target.value)}
            placeholder={placeholder}
          />
        </div>
      )}
      {errorMessage && (
        <span className={classNames('text-rose-500 text-xs')}>
          {errorMessage}
        </span>
      )}
    </div>
  ),
);

Input.displayName = 'Input';
