import { noteName } from "../lib/keyboard";
import { useNarrow } from "../hooks/useNarrow";

/* The coming notes, as chips. Chip width tracks how long the note is,
   so the rhythm is visible even though the lesson itself waits for
   you and never runs on a clock. */
export default function LessonStrip({
  lesson, section, byChar, demoOn, onListen, onRestart,
}) {
  const narrow = useNarrow();
  if (!lesson) return null;

  /* eight chips do not fit across a phone */
  const WINDOW = narrow ? 4 : 8;
  const total = lesson.notes.length;
  const done = lesson.idx >= total;
  const from = Math.max(0, Math.min(lesson.idx - 1, total - WINDOW));
  const shown = lesson.notes.slice(from, from + WINDOW);

  const letterFor = (midi) => {
    const hit = Object.keys(byChar).find((k) => byChar[k] === midi);
    if (!hit) return "·";
    return hit === ";" || hit === "'" ? hit : hit.toUpperCase();
  };

  return (
    <div id="lesson" className="on">
      <span className="cap" id="section">{section}</span>

      {/* during Listen the piano is playing itself, so the keys
          section is not asking you for anything */}
      <div id="chips" className={demoOn ? "listening" : undefined}>
        {done ? (
          <span id="lessonMsg">
            {lesson.misses === 0
              ? "Note perfect."
              : `Done — ${lesson.misses} missed key${lesson.misses === 1 ? "" : "s"}.`}
          </span>
        ) : (
          shown.map((nt, k) => {
            const i = from + k;
            const cls = i < lesson.idx ? "chip done" : i === lesson.idx ? "chip now" : "chip";
            return (
              <span key={i} className={cls} style={{ width: Math.round(30 + nt.d * 16) }}>
                <b>{letterFor(nt.m)}</b>
                <small>{noteName(nt.m)}</small>
              </span>
            );
          })
        )}
      </div>

      <span id="prog">{Math.min(lesson.idx + 1, total)} / {total}</span>

      <div className="lesson-btns">
        <button className="btn" onClick={onListen}>
          {demoOn ? "Playing…" : "Listen"}
        </button>
        <button className="btn" onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}
