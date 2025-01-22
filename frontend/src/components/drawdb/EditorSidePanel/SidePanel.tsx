import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
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
  value: string;
  itemKey: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, itemKey } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== itemKey}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === itemKey && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type SidePanelProps = {
  width: number;
  resize: boolean;
  setResize: React.Dispatch<React.SetStateAction<boolean>>;
};
type TabType = {
  tab: string;
  itemKey: string;
  component: React.ReactNode;
};

export default function SidePanel({
  width,
  resize,
  setResize,
}: SidePanelProps) {
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { database } = useDiagram();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(selectedElement.currentTab);

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

    if (databases?.[database]?.hasTypes) {
      tabs.push({
        tab: t('types'),
        itemKey: TabConst.TYPES,
        component: <TypesTab />,
      });
    }

    if (databases?.[database]?.hasEnums) {
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
          <Tabs
            value={selectedTab}
            onChange={(_e, key) => {
              setSelectedElement((prev) => ({ ...prev, currentTab: key }));
              setSelectedTab(key as string);
            }}
          >
            {tabList?.map((tab: TabType, _index) => (
              <Tab
                key={tab.itemKey}
                value={tab.itemKey}
                {...a11yProps(_index)}
                label={tab.tab}
              ></Tab>
            ))}
          </Tabs>

          {tabList?.map((tab: TabType, _index) => (
            <CustomTabPanel
              key={tab.itemKey}
              itemKey={tab.itemKey}
              value={selectedTab}
              index={_index}
            >
              <div className="">{tab.component} </div>
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
