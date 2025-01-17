import WorkSpace from '@components/drawdb/Workspace';
import { BaseLayout } from '@layouts/BaseLayout';
import LayoutContextProvider from './context/LayoutContext';
import TransformContextProvider from './context/TransformContext';
import SelectContextProvider from './context/SelectContext';
import UndoRedoContextProvider from './context/UndoRedoContext';
import AreasContextProvider from './context/AreasContext';
import TasksContextProvider from './context/TasksContext';
import NotesContextProvider from './context/NotesContext';
import TypesContextProvider from './context/TypesContext';
import EnumsContextProvider from './context/EnumsContext';
import SaveStateContextProvider from './context/SaveStateContext';
import TablesContextProvider from './context/DiagramContext';
import SettingsContextProvider from './context/SettingsContext';
import { useEffect, useState } from 'react';

export function DrawDBEditor() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <BaseLayout>
      {/*<PrivateLayout>*/}
      <SettingsContextProvider>
        <LayoutContextProvider>
          <TransformContextProvider>
            <UndoRedoContextProvider>
              <SelectContextProvider>
                <TasksContextProvider>
                  <AreasContextProvider>
                    <NotesContextProvider>
                      <TypesContextProvider>
                        <EnumsContextProvider>
                          <TablesContextProvider>
                            <SaveStateContextProvider>
                              <WorkSpace />
                            </SaveStateContextProvider>
                          </TablesContextProvider>
                        </EnumsContextProvider>
                      </TypesContextProvider>
                    </NotesContextProvider>
                  </AreasContextProvider>
                </TasksContextProvider>
              </SelectContextProvider>
            </UndoRedoContextProvider>
          </TransformContextProvider>
        </LayoutContextProvider>
      </SettingsContextProvider>
      {/*</PrivateLayout>*/}
    </BaseLayout>
  );
}
