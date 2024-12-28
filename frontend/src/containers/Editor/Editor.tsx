export function Editor() {
    return return (
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
    );
}
