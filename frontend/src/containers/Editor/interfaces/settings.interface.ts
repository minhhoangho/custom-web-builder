export interface EditorSettingsInterface {
  strictMode: boolean;
  showFieldSummary: boolean;
  showGrid: boolean;
  mode: 'light' | 'dark';
  autosave: boolean;
  panning: boolean;
  showCardinality: boolean;
  tableWidth: number;
  showDebugCoordinates: boolean;
}
