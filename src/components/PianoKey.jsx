import { memo } from "react";
import { KB_WIDTH } from "../lib/keyboard";

/* One key: a top face and a front face, hinged at the back edge.
   The stage-light gradient is sized to the whole keyboard and offset
   by --x, so the wash runs unbroken across every key instead of
   repeating per key. */
function PianoKey({ note, down, target, missed }) {
  const cls = [
    "key",
    note.black ? "bk" : "wk",
    down ? "down" : "",
    target ? "target" : "",
    missed ? "miss" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      data-midi={note.midi}
      style={{ left: note.x + "px", "--x": note.x + "px", "--kw": KB_WIDTH + "px" }}
    >
      <div className="top">
        <span className="lbl">{note.letter || ""}</span>
      </div>
      <div className="front" />
    </div>
  );
}

export default memo(PianoKey);
