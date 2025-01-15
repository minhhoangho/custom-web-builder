import { create } from 'zustand';

export type MapFocusPros = {
  lat: number;
  long: number;
  zoom: number;
};


export const useMapFocusStore = create((set) => ({
  mapFocus: null,
  setMapFocus: (mapFocus: MapFocusPros) => set({ mapFocus }),
}));


export const useBevCoordinateStore = create((set) => ({
  bevCoordinate: null,
  setBevCoordinate: (bevCoordinate: any) => set({ bevCoordinate }),
}))