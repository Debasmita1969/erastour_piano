/* The control bar. A segment is a row of buttons where exactly one is
   pressed; the toggles are plain checkboxes wearing a switch. */

function Segment({ id, value, options, onChange, label }) {
  return (
    <div className="grp">
      <span className="cap">{label}</span>
      <div className="seg" id={id}>
        {options.map((o) => (
          <button
            key={o.value}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ id, checked, onChange, children }) {
  return (
    <label className="toggle">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

export default function ControlBar({
  song, onSong, camera, onCamera, voice, onVoice,
  octave, onOctave, octaveLocked,
  volume, onVolume, sustain, onSustain,
  labels, onLabels, backing, onBacking, songs,
}) {
  return (
    <div id="panel">
      <Segment
        id="song" label="Song" value={song} onChange={onSong}
        options={[
          { value: "off", label: "Free play" },
          ...Object.entries(songs).map(([id, s]) => ({ value: id, label: s.name })),
        ]}
      />

      <Segment
        id="cam" label="Camera" value={camera} onChange={onCamera}
        options={[
          { value: "persp", label: "Perspective" },
          { value: "top", label: "Top‑down" },
        ]}
      />

      <Segment
        id="voice" label="Voice" value={voice} onChange={onVoice}
        options={[
          { value: "upright", label: "Upright" },
          { value: "glass", label: "Glass" },
          { value: "neon", label: "Neon" },
          { value: "reed", label: "Reed" },
        ]}
      />

      <div className="grp">
        <span className="cap">Octave</span>
        <div className="stepper">
          <button onClick={() => onOctave(-1)} disabled={octaveLocked} aria-label="Octave down">&minus;</button>
          <span>{octave}</span>
          <button onClick={() => onOctave(1)} disabled={octaveLocked} aria-label="Octave up">+</button>
        </div>
      </div>

      <div className="grp">
        <span className="cap">Volume</span>
        <input
          type="range" min="0" max="100" aria-label="Volume"
          value={Math.round(volume * 100)}
          onChange={(e) => onVolume(Number(e.target.value) / 100)}
        />
      </div>

      <Toggle id="cbSustain" checked={sustain} onChange={onSustain}>Sustain</Toggle>
      <Toggle id="cbLabels" checked={labels} onChange={onLabels}>Letters</Toggle>
      <Toggle id="cbBacking" checked={backing} onChange={onBacking}>Backing</Toggle>
    </div>
  );
}
