import { Input } from '@components/form/Input';
import { useSettings } from 'src/containers/Editor/hooks';

export default function SetTableWidth() {
  const { settings, setSettings } = useSettings();

  return (
    <Input
      placeholder="Table Width"
      type="number"
      className="w-full"
      value={settings.tableWidth}
      onInputChange={(c) => {
        if (c < 180) return;
        setSettings((prev) => ({ ...prev, tableWidth: c }));
      }}
    />
  );
}
