import React, { createContext, useCallback, useState } from 'react';
import { EditorTransformInterface } from '../interfaces';

export const TransformContext = createContext<{
  transform: EditorTransformInterface;
  setTransform: React.Dispatch<React.SetStateAction<EditorTransformInterface>>;
} | null>(null);

export default function TransformContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transform, setTransformInternal] = useState<EditorTransformInterface>({
    zoom: 1,
    pan: { x: 0, y: 0 },
  });

  /**
   * @type {typeof DrawDB.TransformContext["setTransform"]}
   */
  const setTransform = useCallback(
    (actionOrValue: any) => {
      const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(max, value));
      const findFirstNumber = (...values: any) =>
        values.find((value) => typeof value === 'number' && !isNaN(value));

      setTransformInternal((prev) => {
        if (typeof actionOrValue === 'function') {
          actionOrValue = actionOrValue(prev);
        }

        return {
          zoom: clamp(
            findFirstNumber(actionOrValue.zoom, prev.zoom, 1),
            0.02,
            5,
          ),
          pan: {
            x: findFirstNumber(actionOrValue.pan?.x, prev.pan?.x, 0),
            y: findFirstNumber(actionOrValue.pan?.y, prev.pan?.y, 0),
          },
        };
      });
    },
    [setTransformInternal],
  );

  return (
    <TransformContext.Provider value={{ transform, setTransform }}>
      {children}
    </TransformContext.Provider>
  );
}
