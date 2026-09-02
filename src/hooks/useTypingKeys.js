import { useEffect, useRef } from "react";

/* Typing keyboard → notes.

   The listeners are attached once and read their callbacks out of a
   ref. Subscribing on every render would be worse than wasteful: the
   cleanup releases whatever is held, so a re-render mid-note (and
   playing a note causes one) would cut the note off under your
   finger. */
export function useTypingKeys(handlers) {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    const held = new Map();

    const down = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const { byChar, press, onOctave, onSustain } = latest.current;
      const k = e.key.toLowerCase();

      if (k === "z" || k === "x") {
        e.preventDefault();
        onOctave(k === "z" ? -1 : 1);
        return;
      }
      if (k === " ") {
        e.preventDefault();
        onSustain();
        return;
      }

      const midi = byChar[k];
      if (midi === undefined || held.has(k)) return;
      e.preventDefault();
      held.set(k, midi);
      press(midi, e.shiftKey ? 1 : 0.68);
    };

    const up = (e) => {
      const k = e.key.toLowerCase();
      if (!held.has(k)) return;
      latest.current.release(held.get(k));
      held.delete(k);
    };

    const blur = () => {
      held.forEach((midi) => latest.current.release(midi));
      held.clear();
    };

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      blur();
    };
  }, []);
}
