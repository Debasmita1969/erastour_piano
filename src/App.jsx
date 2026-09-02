import { useCallback, useEffect, useMemo, useState } from "react";
import Grain from "./components/Grain";
import PianoStage from "./components/PianoStage";
import ControlBar from "./components/ControlBar";
import LessonStrip from "./components/LessonStrip";
import { usePiano } from "./hooks/usePiano";
import { useTypingKeys } from "./hooks/useTypingKeys";
import { buildLayout } from "./lib/keyboard";
import { SONGS } from "./data/songs";
import * as engine from "./audio/engine";

export default function App() {
  const [song, setSong] = useState("off");
  const [camera, setCamera] = useState("persp");
  const [voice, setVoice] = useState("upright");
  const [volume, setVolume] = useState(0.72);
  const [sustain, setSustain] = useState(false);
  const [labels, setLabels] = useState(true);
  const [backing, setBacking] = useState(true);
  const [octave, setOctave] = useState(4);

  const piano = usePiano();
  const layout = useMemo(() => buildLayout(octave), [octave]);
  const inLesson = piano.lesson !== null;

  /* settings live in React, the engine is told when they change */
  useEffect(() => { engine.setVoice(voice); }, [voice]);
  useEffect(() => { engine.setVolume(volume); }, [volume]);
  useEffect(() => { engine.setSustain(sustain); }, [sustain]);
  useEffect(() => { engine.setBacking(backing); }, [backing]);
  useEffect(() => {
    document.body.classList.toggle("nolabels", !labels);
  }, [labels]);

  /* iOS will not start audio outside a gesture, and suspends it again
     whenever the page goes to the background. Capture phase so this
     runs before the key handlers do. */
  useEffect(() => {
    const unlock = () => engine.unlockAudio();
    const wake = () => {
      if (document.visibilityState === "visible") engine.resumeAudio();
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("focus", wake);
    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("focus", wake);
    };
  }, []);

  const shiftOctave = useCallback((d) => {
    if (inLesson) return;              /* pinned while a lesson runs */
    setOctave((o) => Math.min(6, Math.max(1, o + d)));
    piano.panic();
  }, [inLesson, piano.panic]);

  const chooseSong = useCallback((id) => {
    setSong(id);
    piano.panic();
    const wants = piano.startSong(id);
    if (wants) setOctave(wants);       /* each song names its register */
  }, [piano.panic, piano.startSong]);

  useTypingKeys({
    byChar: layout.byChar,
    press: piano.press,
    release: piano.release,
    onOctave: shiftOctave,
    onSustain: () => setSustain((s) => !s),
  });

  return (
    <>
      <div id="room" />
      <Grain />

      <PianoStage
        layout={layout}
        downs={piano.downs}
        target={piano.target}
        missed={piano.missed}
        camera={camera}
        press={piano.press}
        release={piano.release}
      />

      <LessonStrip
        lesson={piano.lesson}
        section={piano.section}
        byChar={layout.byChar}
        demoOn={piano.demoOn}
        onListen={piano.listen}
        onRestart={piano.restart}
      />

      <ControlBar
        songs={SONGS}
        song={song} onSong={chooseSong}
        camera={camera} onCamera={setCamera}
        voice={voice} onVoice={setVoice}
        octave={octave} onOctave={shiftOctave} octaveLocked={inLesson}
        volume={volume} onVolume={setVolume}
        sustain={sustain} onSustain={setSustain}
        labels={labels} onLabels={setLabels}
        backing={backing} onBacking={setBacking}
      />

      <p id="hint">
        <span className="wide">
          Play with your keyboard &middot; <b>Z</b> <b>X</b> shift octave &middot;{" "}
          <b>Space</b> holds sustain &middot; pick a song and follow the lit keys
        </span>
        <span className="narrow">
          Turn your phone sideways for bigger keys &middot; pick a song and
          follow the lit keys
        </span>
      </p>
    </>
  );
}
