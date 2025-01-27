import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tableThemes } from 'src/constants/editor';
import { Iconify } from '@components/common';

export function ColorPalette({
  currentColor,
  onClearColor,
  onPickColor,
}: {
  currentColor: string;
  onClearColor: () => void;
  onPickColor: (color: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div className="font-medium">{t('theme')}</div>
        <Button variant="outlined" size="small" onClick={onClearColor}>
          {t('clear')}
        </Button>
      </div>
      <hr />
      <div className="py-3 space-y-3">
        <div className="flex flex-wrap w-72 gap-y-2">
          {tableThemes.map((c) => (
            <button
              key={c}
              style={{ backgroundColor: c }}
              className="w-10 h-10 rounded-full mx-1"
              onClick={() => onPickColor(c)}
            >
              <Iconify
                icon="mdi:checkbox-outline"
                sx={{ color: currentColor === c ? 'white' : c }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
