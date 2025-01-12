import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTransform, useLayout } from 'src/containers/Editor/hooks';

export default function FloatingControls() {
  const { transform, setTransform } = useTransform();
  const { setLayout } = useLayout();
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <div className="popover-theme flex rounded-lg items-center">
        <button
          className="px-3 py-2"
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              zoom: prev.zoom / 1.2,
            }))
          }
        >
          <i className="bi bi-dash-lg" />
        </button>
        <Divider textAlign="center" orientation="vertical" />
        <div className="px-3 py-2">{parseInt(transform.zoom * 100)}%</div>
        <Divider textAlign="center" orientation="vertical" />
        <button
          className="px-3 py-2"
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              zoom: prev.zoom * 1.2,
            }))
          }
        >
          <i className="bi bi-plus-lg" />
        </button>
      </div>
      {/*<Tooltip content={t("exit")}>*/}
      {/*  <button*/}
      {/*    className="px-3 py-2 rounded-lg popover-theme"*/}
      {/*    onClick={() => {*/}
      {/*      setLayout((prev) => ({*/}
      {/*        ...prev,*/}
      {/*        sidebar: true,*/}
      {/*        toolbar: true,*/}
      {/*        header: true,*/}
      {/*      }));*/}
      {/*      exitFullscreen();*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <i className="bi bi-fullscreen-exit" />*/}
      {/*  </button>*/}
      {/*</Tooltip>*/}
    </div>
  );
}
