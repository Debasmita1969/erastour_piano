import { useCallback, useMemo, useRef, useState } from "react";
import { noteOn, kill, allOff, playChord, stopPad } from "../audio/engine";
import { SONGS } from "../data/songs";

/* Playing and lessons.

   The live lesson lives in a ref, not in state. Two correct keys can
   land in the same frame, and reading `idx` off state would let the
   second one see a stale value and judge against the wrong note. The
   ref is the source of truth; a version counter pushes renders. */
export function usePiano() {
  const [downs, setDowns] = useState(() => new Set());
  const [target, setTarget] = useState(null);
  const [missed, setMissed] = useState(null);
  const [, bump] = useState(0);

  const downsRef = useRef(new Set());
  const lessonRef = useRef(null);
  const missTimer = useRef(null);
  const demoTimers = useRef([]);
  const demoRef = useRef(false);
  const [demoOn, setDemoOn] = useState(false);

  const render = useCallback(() => bump((v) => v + 1), []);
  const lesson = lessonRef.current;

  const syncDowns = useCallback(() => setDowns(new Set(downsRef.current)), []);

  const judge = useCallback((midi) => {
    const L = lessonRef.current;
    if (!L || L.idx >= L.notes.length) return;

    if (midi === L.notes[L.idx].m) {
      /* the harmony moves with you, not on a clock */
      const chord = L.chordFor[L.idx];
      if (chord) playChord(chord);
      L.idx += 1;
      setTarget(L.idx < L.notes.length ? L.notes[L.idx].m : null);
      render();
    } else {
      L.misses += 1;
      setMissed(midi);
      clearTimeout(missTimer.current);
      missTimer.current = setTimeout(() => setMissed(null), 440);
      render();
    }
  }, [render]);

  const press = useCallback((midi, vel, fromDemo) => {
    if (downsRef.current.has(midi)) return;
    if (lessonRef.current && !fromDemo) judge(midi);
    downsRef.current.add(midi);
    syncDowns();
    noteOn(midi, vel === undefined ? 0.65 : vel);
  }, [judge, syncDowns]);

  const release = useCallback((midi) => {
    if (!downsRef.current.delete(midi)) return;
    syncDowns();
    kill(midi, false);
  }, [syncDowns]);

  const panic = useCallback(() => {
    allOff();
    downsRef.current.clear();
    syncDowns();
  }, [syncDowns]);

  /* ── Listen ─────────────────────────────────────────────────── */
  const stopDemo = useCallback(() => {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    if (demoRef.current) {
      demoRef.current = false;
      setDemoOn(false);
      panic();
      const L = lessonRef.current;
      setTarget(L && L.idx < L.notes.length ? L.notes[L.idx].m : null);
    }
    stopPad();
  }, [panic]);

  const listen = useCallback(() => {
    const L = lessonRef.current;
    if (!L) return;
    if (demoRef.current) return stopDemo();

    demoRef.current = true;
    setDemoOn(true);
    const beat = 60000 / L.tempo;
    let t = 250;

    L.notes.forEach((nt, i) => {
      const dur = nt.d * beat;
      demoTimers.current.push(setTimeout(() => {
        setTarget(nt.m);
        if (L.chordFor[i]) playChord(L.chordFor[i]);
        press(nt.m, 0.72, true);
      }, t));
      demoTimers.current.push(setTimeout(() => release(nt.m), t + dur * 0.82));
      t += dur;
    });
    demoTimers.current.push(setTimeout(stopDemo, t + 320));
  }, [press, release, stopDemo]);

  /* ── Lesson control ─────────────────────────────────────────── */
  const startSong = useCallback((id) => {
    stopDemo();
    if (id === "off") {
      lessonRef.current = null;
      setTarget(null);
      setMissed(null);
      render();
      return null;
    }
    const s = SONGS[id];
    const chordFor = {};
    (s.at || []).forEach(([noteIdx, chordIdx]) => {
      chordFor[noteIdx] = s.chords[chordIdx];
    });
    lessonRef.current = {
      id, name: s.name, tempo: s.tempo, notes: s.notes,
      idx: 0, misses: 0, chordFor,
    };
    setTarget(s.notes[0].m);
    setMissed(null);
    render();
    return s.oct || 4;             /* the register this song is written in */
  }, [render, stopDemo]);

  const restart = useCallback(() => {
    const L = lessonRef.current;
    if (!L) return;
    stopDemo();
    L.idx = 0;
    L.misses = 0;
    setTarget(L.notes[0].m);
    render();
  }, [render, stopDemo]);

  /* which section the playhead sits in */
  const section = useMemo(() => {
    if (!lesson) return "";
    let s = "";
    for (let i = 0; i <= lesson.idx && i < lesson.notes.length; i++) {
      if (lesson.notes[i].s) s = lesson.notes[i].s;
    }
    return s;
  }, [lesson, lesson && lesson.idx]);

  return {
    downs, target, missed, lesson, section, demoOn,
    press, release, panic, listen, startSong, restart,
  };
}
