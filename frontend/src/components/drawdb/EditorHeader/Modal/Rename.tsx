import { useTranslation } from 'react-i18next';
import { Input } from '@components/form/Input';

export default function Rename({ title, setTitle }) {
  const { t } = useTranslation();

  return (
    <Input
      placeholder={t('name')}
      value={title}
      onInputChange={(v) => setTitle(v)}
    />
  );
}
