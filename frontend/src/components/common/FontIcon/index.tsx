import React from 'react';
import classNames from 'classnames';

const FontIcon = ({
  className,
  status,
  iconName = '',
  disabled = false,
  onClick = () => {},
}: {
  className: string;
  status?: string;
  iconName: string;
  disabled?: boolean;
  onClick?: any;
}) => {
  return (
    <i
      onClick={!disabled ? onClick : null}
      className={classNames(`opleicon-${iconName}`, className, status, {
        disabled,
      })}
    />
  );
};

export { FontIcon };
