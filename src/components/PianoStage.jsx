import { useCallback, useRef } from "react";
import PianoKey from "./PianoKey";
import PaintedPanel from "./PaintedPanel";
import Wood from "./Wood";
import { useStageFit } from "../hooks/useStageFit";
import {
  CASE_WIDTH, KB_WIDTH, CHEEK, WK_D, BOARD, RAIL,
} from "../lib/keyboard";

/* The instrument. Everything below #rig lives in one preserve-3d
   space: the keybed lies flat, the boards stand up in front and
   behind it, and each key is a little box hinged at its back edge. */
export default function PianoStage({
  layout, downs, target, missed, camera, press, release,
}) {
  const rig = useRef(null);
  const active = useRef(new Map());   /* pointerId → midi */
  useStageFit(rig, camera);

  /* Which key is under the pointer — read from the page rather than
     from React, so dragging across the keys glissandos properly. */
  const noteAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const key = el && el.closest(".key");
    return key ? Number(key.dataset.midi) : null;
  };

  const onDown = useCallback((e) => {
    const midi = noteAt(e.clientX, e.clientY);
    if (midi === null) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not fatal */ }
    active.current.set(e.pointerId, midi);

    /* strike lower on a key for more force, the way a real key gives
       more leverage towards the front */
    const r = e.target.getBoundingClientRect();
    const along = (e.clientY - r.top) / Math.max(1, r.height);
    press(midi, e.shiftKey ? 1 : Math.max(0.25, Math.min(1, 0.35 + along * 0.75)));
  }, [press]);

  const onMove = useCallback((e) => {
    const held = active.current.get(e.pointerId);
    if (held === undefined) return;
    const midi = noteAt(e.clientX, e.clientY);
    if (midi === null || midi === held) return;
    release(held);
    active.current.set(e.pointerId, midi);
    press(midi, 0.6);
  }, [press, release]);

  const onUp = useCallback((e) => {
    const held = active.current.get(e.pointerId);
    if (held === undefined) return;
    active.current.delete(e.pointerId);
    release(held);
  }, [release]);

  const keyProps = (note) => ({
    note,
    down: downs.has(note.midi),
    target: target === note.midi,
    missed: missed === note.midi,
  });

  return (
    <div
      id="stage"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div id="rig" ref={rig}>
        <div id="floorglow" />
        <div id="case" style={{ "--kw": KB_WIDTH + "px" }}>
          <PaintedPanel
            id="fallboard" width={CASE_WIDTH} height={BOARD}
            seed={77123} opts={{ lanes: 2, frames: 3, density: 190, filler: 340 }}
          />


          <div id="keybed" style={{ width: CASE_WIDTH, height: WK_D }}>
            <Wood width={CASE_WIDTH} height={WK_D} seed={4411} dark={0.1} />
            {/* end blocks are cut across the grain, so no figure */}
            <div className="cheek l">
              <Wood width={CHEEK} height={WK_D} seed={881} figure={0} />
              <div className="face" />
            </div>
            <div className="cheek r">
              <Wood width={CHEEK} height={WK_D} seed={2277} figure={0} />
              <div className="face" />
            </div>
            <div
              id="keys"
              style={{ left: CHEEK, top: 0, width: KB_WIDTH, height: WK_D, "--kw": KB_WIDTH + "px" }}
            >
              {/* whites first, sharps over the top */}
              {layout.white.map((n) => <PianoKey key={n.midi} {...keyProps(n)} />)}
              {layout.black.map((n) => <PianoKey key={n.midi} {...keyProps(n)} />)}
            </div>
          </div>

          <PaintedPanel
            id="rail" width={CASE_WIDTH} height={RAIL}
            seed={20260901} opts={{ lanes: 1, frames: 1, density: 230, filler: 520 }}
          />
        </div>
      </div>
    </div>
  );
}
