import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { useEventListener, useResizeObserver } from 'usehooks-ts';
import { useTransform } from '../hooks';

// const defaultDOMRect = {
//   x: 0,
//   y: 0,
//   width: 0,
//   height: 0,
//   top: 0,
//   right: 0,
//   bottom: 0,
//   left: 0,
//   toJSON: () => ({}),
// };

export const CanvasContext = createContext<{
  canvas: {
    screenSize: {
      x: number;
      y: number;
    };
    viewBox: DOMRect | null;
  };
  coords: {
    toDiagramSpace(coords: { x: number; y: number }): {
      x: number | undefined;
      y: number | undefined;
    };
    toScreenSpace(coords: { x: number; y: number }): {
      x: number | undefined;
      y: number | undefined;
    };
  };
  pointer: {
    spaces: {
      screen: {
        x: number;
        y: number;
      };
      diagram: {
        x: number | undefined;
        y: number | undefined;
      };
    };
    style: string;
    setStyle(style: string): void;
  };
}>({
  canvas: {
    screenSize: {
      x: 0,
      y: 0,
    },
    viewBox: null,
    // viewBox: defaultDOMRect,
  },
  coords: {
    toDiagramSpace(coords) {
      return coords;
    },
    toScreenSpace(coords) {
      return coords;
    },
  },
  pointer: {
    spaces: {
      screen: {
        x: 0,
        y: 0,
      },
      diagram: {
        x: 0,
        y: 0,
      },
    },
    style: 'default',
    setStyle() {},
  },
});

export function CanvasContextProvider({
  children,
  ...attrs
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  const canvasWrapRef = useRef(null);
  const { transform } = useTransform();
  const canvasSize = useResizeObserver({
    ref: canvasWrapRef,
    box: 'content-box',
  });

  const screenSize = useMemo(
    () => ({
      x: canvasSize.width ?? 0,
      y: canvasSize.height ?? 0,
    }),
    [canvasSize.height, canvasSize.width],
  );
  const viewBoxSize = useMemo(
    () => ({
      x: screenSize.x / transform.zoom,
      y: screenSize.y / transform.zoom,
    }),
    [screenSize.x, screenSize.y, transform.zoom],
  );

  const viewBox = useMemo(
    () =>
      new DOMRect(
        transform.pan.x - viewBoxSize.x / 2,
        transform.pan.y - viewBoxSize.y / 2,
        viewBoxSize.x,
        viewBoxSize.y,
      ),
    [transform.pan.x, transform.pan.y, viewBoxSize.x, viewBoxSize.y],
  );

  const toDiagramSpace = useCallback(
    (coord: { x: number; y: number }) => ({
      x:
        typeof coord.x === 'number' && viewBox
          ? (coord.x / screenSize.x) * viewBox.width + viewBox.left
          : undefined,
      y:
        typeof coord.y === 'number' && viewBox
          ? (coord.y / screenSize.y) * viewBox.height + viewBox.top
          : undefined,
    }),
    [
      screenSize.x,
      screenSize.y,
      viewBox?.height,
      viewBox?.left,
      viewBox?.top,
      viewBox?.width,
    ],
  );

  const toScreenSpace = useCallback(
    (coord: { x: number; y: number }) => ({
      x:
        typeof coord.x === 'number' && viewBox
          ? ((coord.x - viewBox.left) / viewBox.width) * screenSize.x
          : undefined,
      y:
        typeof coord.y === 'number' && viewBox
          ? ((coord.y - viewBox.top) / viewBox.height) * screenSize.y
          : undefined,
    }),
    [
      screenSize.x,
      screenSize.y,
      viewBox?.height,
      viewBox?.left,
      viewBox?.top,
      viewBox?.width,
    ],
  );

  const [pointerScreenCoords, setPointerScreenCoords] = useState({
    x: 0,
    y: 0,
  });
  const pointerDiagramCoords = useMemo(
    () => toDiagramSpace(pointerScreenCoords),
    [pointerScreenCoords, toDiagramSpace],
  );
  const [pointerStyle, setPointerStyle] = useState('default');

  /**
   * @param {PointerEvent} e
   */
  function detectPointerMovement(e) {
    const targetElm =
      /** @type {HTMLElement | null} */ e.currentTarget as HTMLElement | null;
    if (!e.isPrimary || !targetElm) return;

    const canvasBounds = targetElm?.getBoundingClientRect();

    setPointerScreenCoords({
      x: e.clientX - canvasBounds.left,
      y: e.clientY - canvasBounds.top,
    });
  }

  // Important for touch screen devices!

  useEventListener('pointerdown', detectPointerMovement, canvasWrapRef);
  useEventListener('pointermove', detectPointerMovement, canvasWrapRef);

  const contextValue = {
    canvas: {
      screenSize,
      viewBox,
    },
    coords: {
      toDiagramSpace,
      toScreenSpace,
    },
    pointer: {
      spaces: {
        screen: pointerScreenCoords,
        diagram: pointerDiagramCoords,
      },
      style: pointerStyle,
      setStyle: setPointerStyle,
    },
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      <div {...attrs} ref={canvasWrapRef}>
        {children}
      </div>
    </CanvasContext.Provider>
  );
}
