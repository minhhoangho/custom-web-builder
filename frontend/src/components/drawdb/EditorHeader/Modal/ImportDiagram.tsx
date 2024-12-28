// import { Upload, Banner } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  ddbDiagramIsValid,
  jsonDiagramIsValid,
} from 'src/utils/schema-validation';
import {
  useArea,
  useDiagram,
  useEnum,
  useNote,
  useType,
} from 'src/containers/Editor/hooks';
import { DB, STATUS } from '@constants/editor';
import { Banner } from '@components/common';

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

export default function ImportDiagram({ setImportData, error, setError }) {
  const { areas } = useArea();
  const { notes } = useNote();
  const { tables, relationships, database } = useDiagram();
  const { types } = useType();
  const { enums } = useEnum();
  const { t } = useTranslation();

  const diagramIsEmpty = () => {
    return (
      tables.length === 0 &&
      relationships.length === 0 &&
      notes.length === 0 &&
      areas.length === 0 &&
      types.length === 0 &&
      enums.length === 0
    );
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const fileList = event.target.files;
    const f = fileList[0];
    if (!f) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      let jsonObject = null;
      try {
        jsonObject = JSON.parse(e.target.result);
      } catch (error) {
        setError({
          type: STATUS.ERROR,
          message: 'The file contains an error.',
        });
        return;
      }
      if (f.type === 'application/json') {
        if (!jsonDiagramIsValid(jsonObject)) {
          setError({
            type: STATUS.ERROR,
            message: 'The file is missing necessary properties for a diagram.',
          });
          return;
        }
      } else if (f.name.split('.').pop() === 'ddb') {
        if (!ddbDiagramIsValid(jsonObject)) {
          setError({
            type: STATUS.ERROR,
            message: 'The file is missing necessary properties for a diagram.',
          });
          return;
        }
      }

      if (!jsonObject.database) {
        jsonObject.database = DB.GENERIC;
      }

      if (jsonObject.database !== database) {
        setError({
          type: STATUS.ERROR,
          message:
            "The imported diagram and the open diagram don't use matching databases.",
        });
        return;
      }

      let ok = true;
      jsonObject.relationships.forEach((rel) => {
        if (
          !jsonObject.tables[rel.startTableId] ||
          !jsonObject.tables[rel.endTableId]
        ) {
          setError({
            type: STATUS.ERROR,
            message: `Relationship ${rel.name} references a table that does not exist.`,
          });
          ok = false;
          return;
        }

        if (
          !jsonObject.tables[rel.startTableId].fields[rel.startFieldId] ||
          !jsonObject.tables[rel.endTableId].fields[rel.endFieldId]
        ) {
          setError({
            type: STATUS.ERROR,
            message: `Relationship ${rel.name} references a field that does not exist.`,
          });
          ok = false;
          return;
        }
      });

      if (!ok) return;

      setImportData(jsonObject);
      if (diagramIsEmpty()) {
        setError({
          type: STATUS.OK,
          message: 'Everything looks good. You can now import.',
        });
      } else {
        setError({
          type: STATUS.WARNING,
          message:
            'The current diagram is not empty. Importing a new diagram will overwrite the current changes.',
        });
      }
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
        <VisuallyHiddenInput type="file" onChange={handleUpload} multiple />
      </Button>
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
  );
}
