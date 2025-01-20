import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Box } from '@mui/material';
import { databases } from 'src/data/database';
import { useDiagram, useLayout, useSelect } from 'src/containers/Editor/hooks';
import { Tab as TabConst } from '@constants/editor';
import RelationshipsTab from './RelationshipsTab/RelationshipsTab';
import TypesTab from './TypesTab/TypesTab';
import Issues from './Issues';
import AreasTab from './AreasTab/AreasTab';
import NotesTab from './NotesTab/NotesTab';
import TablesTab from './TablesTab/TablesTab';
import EnumsTab from './EnumsTab/EnumsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SidePanel({ width, resize, setResize }) {
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { database } = useDiagram();
  const { t } = useTranslation();

  const tabList = useMemo(() => {
    const tabs = [
      { tab: t('tables'), itemKey: TabConst.TABLES, component: <TablesTab /> },
      {
        tab: t('relationships'),
        itemKey: TabConst.RELATIONSHIPS,
        component: <RelationshipsTab />,
      },
      {
        tab: t('subject_areas'),
        itemKey: TabConst.AREAS,
        component: <AreasTab />,
      },
      { tab: t('notes'), itemKey: TabConst.NOTES, component: <NotesTab /> },
    ];

    if (databases[database].hasTypes) {
      tabs.push({
        tab: t('types'),
        itemKey: TabConst.TYPES,
        component: <TypesTab />,
      });
    }

    if (databases[database].hasEnums) {
      tabs.push({
        tab: t('enums'),
        itemKey: TabConst.ENUMS,
        component: <EnumsTab />,
      });
    }

    return tabs;
  }, [t, database]);

  return (
    <div className="flex h-full">
      <div
        className="flex flex-col h-full relative border-r border-color"
        style={{ width: `${width}px` }}
      >
        <div className="h-full flex-1 overflow-y-auto">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedElement.currentTab}
              onChange={(key) =>
                setSelectedElement((prev) => ({ ...prev, currentTab: key }))
              }
            >
              {tabList.length &&
                tabList.map((tab, _index) => (
                  <Tab
                    key={tab.itemKey}
                    value={tab.itemKey}
                    {...a11yProps(_index)}
                  >
                    {tab.tab}
                  </Tab>
                ))}
            </Tabs>
          </Box>

          {tabList.length &&
            tabList.map((tab, _index) => (
              <CustomTabPanel
                key={tab.itemKey}
                value={tab.itemKey}
                index={_index}
              >
                <div className="p-2">{tab.component}</div>
              </CustomTabPanel>
            ))}
        </div>
        {layout.issues && (
          <div className="mt-auto border-t-2 border-color shadow-inner">
            <Issues />
          </div>
        )}
      </div>

      <div
        className={`flex justify-center items-center p-1 h-auto hover:bg-gray-300 cursor-col-resize ${
          resize && 'bg-semi-grey-2'
        }`}
        onPointerDown={(e) => e.isPrimary && setResize(true)}
      >
        <div className="w-1 border-x border-color h-1/6" />
      </div>
    </div>
  );
}
