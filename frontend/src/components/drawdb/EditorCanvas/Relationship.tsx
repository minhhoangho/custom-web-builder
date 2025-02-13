import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@mui/material';
import { Cardinality, ObjectType, Tab } from '@constants/editor';
import {
  useDiagram,
  useLayout,
  useSelect,
  useSettings,
} from 'src/containers/Editor/hooks';
import { calcPath } from 'src/utils/drawdb';
import { DRelationship } from 'src/data/interface';
import RelationshipInfo from '../EditorSidePanel/RelationshipsTab/RelationshipInfo';

export default function Relationship({ data }: { data: DRelationship }) {
  const { settings } = useSettings();
  const { tables } = useDiagram();
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();
  const pathRef = useRef();

  let cardinalityStart = '1';
  let cardinalityEnd = '1';

  switch (data.cardinality) {
    // the translated values are to ensure backwards compatibility
    case t(Cardinality.MANY_TO_ONE):
    case Cardinality.MANY_TO_ONE:
      cardinalityStart = 'n';
      cardinalityEnd = '1';
      break;
    case t(Cardinality.ONE_TO_MANY):
    case Cardinality.ONE_TO_MANY:
      cardinalityStart = '1';
      cardinalityEnd = 'n';
      break;
    case t(Cardinality.ONE_TO_ONE):
    case Cardinality.ONE_TO_ONE:
      cardinalityStart = '1';
      cardinalityEnd = '1';
      break;
    default:
      break;
  }

  let cardinalityStartX = 0;
  let cardinalityEndX = 0;
  let cardinalityStartY = 0;
  let cardinalityEndY = 0;

  const cardinalityOffset = 28;

  if (pathRef.current) {
    const pathLength = pathRef.current.getTotalLength();
    const point1 = pathRef.current.getPointAtLength(cardinalityOffset);
    cardinalityStartX = point1.x;
    cardinalityStartY = point1.y;
    const point2 = pathRef.current.getPointAtLength(
      pathLength - cardinalityOffset,
    );
    cardinalityEndX = point2.x;
    cardinalityEndY = point2.y;
  }

  const edit = () => {
    if (!layout.sidebar) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.RELATIONSHIP,
        id: data.id,
        open: true,
      }));
    } else {
      setSelectedElement((prev) => ({
        ...prev,
        currentTab: Tab.RELATIONSHIPS,
        element: ObjectType.RELATIONSHIP,
        id: data.id,
        open: true,
      }));
      if (selectedElement.currentTab !== Tab.RELATIONSHIPS) return;
      document
        .getElementById(`scroll_ref_${data.id}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <g className="select-none group" onDoubleClick={edit}>
        <path
          ref={pathRef}
          d={calcPath(
            {
              ...data,
              startTable: {
                x: tables[data.startTableId].x,
                y: tables[data.startTableId].y,
              },
              endTable: {
                x: tables[data.endTableId].x,
                y: tables[data.endTableId].y,
              },
            },
            settings.tableWidth,
          )}
          stroke="gray"
          className="group-hover:stroke-sky-700"
          fill="none"
          strokeWidth={2}
          cursor="pointer"
        />
        {pathRef.current && settings.showCardinality && (
          <>
            <circle
              cx={cardinalityStartX}
              cy={cardinalityStartY}
              r="12"
              fill="grey"
              className="group-hover:fill-sky-700"
            />
            <text
              x={cardinalityStartX}
              y={cardinalityStartY}
              fill="white"
              strokeWidth="0.5"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {cardinalityStart}
            </text>
            <circle
              cx={cardinalityEndX}
              cy={cardinalityEndY}
              r="12"
              fill="grey"
              className="group-hover:fill-sky-700"
            />
            <text
              x={cardinalityEndX}
              y={cardinalityEndY}
              fill="white"
              strokeWidth="0.5"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {cardinalityEnd}
            </text>
          </>
        )}
      </g>
      <Drawer
        title={t('edit')}
        // size="small"
        open={
          selectedElement.element === ObjectType.RELATIONSHIP &&
          selectedElement.id === data.id &&
          selectedElement.open &&
          !layout.sidebar
        }
        onCancel={() => {
          setSelectedElement((prev) => ({
            ...prev,
            open: false,
          }));
        }}
        style={{ paddingBottom: '16px' }}
      >
        <div className="sidesheet-theme">
          <RelationshipInfo data={data} />
        </div>
      </Drawer>
    </>
  );
}
