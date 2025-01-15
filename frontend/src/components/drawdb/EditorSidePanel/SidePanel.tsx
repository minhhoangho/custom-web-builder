import { Tab as TabHeader } from '@mui/base/Tab';
import { TabPanel, Tabs, TabsList } from '@mui/base';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { databases } from 'src/data/database';
import { useDiagram, useLayout, useSelect } from 'src/containers/Editor/hooks';
import { Tab } from '@constants/editor';
import RelationshipsTab from './RelationshipsTab/RelationshipsTab';
import TypesTab from './TypesTab/TypesTab';
import Issues from './Issues';
import AreasTab from './AreasTab/AreasTab';
import NotesTab from './NotesTab/NotesTab';
import TablesTab from './TablesTab/TablesTab';
import EnumsTab from './EnumsTab/EnumsTab';

export default function SidePanel({ width, resize, setResize }) {
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { database } = useDiagram();
  const { t } = useTranslation();

  const tabList = useMemo(() => {
    const tabs = [
      { tab: t('tables'), itemKey: Tab.TABLES, component: <TablesTab /> },
      {
        tab: t('relationships'),
        itemKey: Tab.RELATIONSHIPS,
        component: <RelationshipsTab />,
      },
      { tab: t('subject_areas'), itemKey: Tab.AREAS, component: <AreasTab /> },
      { tab: t('notes'), itemKey: Tab.NOTES, component: <NotesTab /> },
    ];

    if (databases[database].hasTypes) {
      tabs.push({
        tab: t('types'),
        itemKey: Tab.TYPES,
        component: <TypesTab />,
      });
    }

    if (databases[database].hasEnums) {
      tabs.push({
        tab: t('enums'),
        itemKey: Tab.ENUMS,
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
            value={selectedElement.currentTab}
            onChange={(key) =>
              setSelectedElement((prev) => ({ ...prev, currentTab: key }))
            }
          >
            <TabsList>
              {tabList.length &&
                tabList.map((tab) => (
                  <TabHeader key={tab.itemKey} value={tab.itemKey}>
                    {tab.tab}
                  </TabHeader>
                ))}
            </TabsList>
          </Tabs>
          {tabList.length &&
            tabList.map((tab) => (
              <TabPanel key={tab.itemKey} value={tab.itemKey}>
                <div className="p-2">{tab.component}</div>
              </TabPanel>
            ))}
        </div>
        {layout.issues && (
          <div className="mt-auto border-t-2 border-color shadow-inner">
            <Issues />
          </div>
        )}
      </div>

      <div
        className={`flex justify-center items-center p-1 h-auto hover-2 cursor-col-resize ${
          resize && 'bg-semi-grey-2'
        }`}
        onPointerDown={(e) => e.isPrimary && setResize(true)}
      >
        <div className="w-1 border-x border-color h-1/6" />
      </div>
    </div>
  );
}
