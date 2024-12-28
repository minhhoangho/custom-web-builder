import { Input } from '@components/form/Input';
import { useSetting } from 'src/containers/Editor/hooks';

export default function SetTableWidth() {
  const { settings, setSettings } = useSetting();

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
