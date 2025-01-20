import { useTranslation } from 'react-i18next';
import React from 'react';
import { Input } from '@components/form/Input';

type RenameProps = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export default function Rename({ title, setTitle }: RenameProps) {
  const { t } = useTranslation();
  const [name, setName] = React.useState(title);

  const updateName = (v: string) => {
    setName(v);
    setTitle(v);
  };

  return (
    <Input placeholder={t('name')} value={name} onInputChange={updateName} />
  );
}
