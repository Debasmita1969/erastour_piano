import { useEffect, useRef } from "react";
import { paint } from "../lib/painting";
import Wood from "./Wood";

/* A routed wooden board with folk brushwork on it. The painting is
   generated imperatively because it walks the real vine curve with
   getPointAtLength to hang leaves at the right angle — which needs a
   live SVG element, not a virtual one. */
export default function PaintedPanel({ id, width, height, seed, opts, woodSeed }) {
  const svg = useRef(null);

  useEffect(() => {
    if (svg.current) paint(svg.current, width, height, seed, id, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, width, height, seed]);

  return (
    <div className="panel" id={id}>
      <Wood width={width} height={height} seed={woodSeed ?? seed} />
      <svg ref={svg} aria-hidden="true" />
    </div>
  );
}
