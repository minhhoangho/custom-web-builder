import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { STATUS } from '@constants/editor';
import { Banner, Checkbox } from '@components/common';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImportSource({
  importData,
  setImportData,
  error,
  setError,
}) {
  const { t } = useTranslation();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const fileList = event.target.files[0];
    const f = fileList[0];
    if (!f) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      setImportData((prev) => ({ ...prev, src: e.target.result }));
    };
    reader.readAsText(f);

    return {
      autoRemove: false,
      fileInstance: file.fileInstance,
      status: 'success',
      shouldUpload: false,
    };
  };

  return (
    <div>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleUpload()} multiple />
      </Button>
      <div className="mt-2">
        <Checkbox
          checked={importData.overwrite}
          defaultChecked
          onChange={(e) =>
            setImportData((prev) => ({
              ...prev,
              overwrite: e.target.checked,
            }))
          }
        >
          {t('overwrite_existing_diagram')}
        </Checkbox>
        <div className="mt-2">
          {error.type === STATUS.ERROR ? (
            <Banner type="error" description={error.message} />
          ) : error.type === STATUS.OK ? (
            <Banner type="info" description={error.message} />
          ) : (
            error.type === STATUS.WARNING && (
              <Banner type="warning" description={error.message} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
