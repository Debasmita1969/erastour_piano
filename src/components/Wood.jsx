import { useEffect, useRef } from "react";
import { paintWood } from "../lib/wood";

/* A wooden surface. The grain is painted onto a canvas sized to the
   element, so no two boards share a pattern. */
export default function Wood({ width, height, seed, lamp = 1, figure = 1, dark = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) paintWood(ref.current, width, height, seed, { lamp, figure, dark });
  }, [width, height, seed, lamp, figure, dark]);

  return <canvas className="wood" ref={ref} aria-hidden="true" />;
}
