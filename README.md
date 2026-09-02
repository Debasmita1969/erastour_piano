# Painted Piano

A playable piano built as real CSS 3D — a hand-painted walnut folk
instrument lit by a warm practice lamp — that can teach you a song by
lighting up the next key.

```bash
npm install
npm run dev
```

## What it does

- **Play** with the mouse or the typing keyboard. Drag across the keys
  to glissando. Striking lower on a key hits harder, the way a real key
  gives more leverage toward the front.
- **Learn a song.** Pick one and the next key glows until you play it.
  Wrong keys sound and flash red without advancing — no clock, no fail
  state. `Listen` plays the phrase back in time.
- **Backing chords** move with you rather than on a beat: each chord
  change is pinned to the melody note it lands on.
- **Two cameras** — a 58° perspective and a flat top-down.

Keyboard: home row walks the white keys, the row above takes the
sharps. `Z`/`X` shift octave, `Space` holds sustain, `Shift` strikes
harder.

## Layout

```
src/
  audio/engine.js      Web Audio synth + backing pad. Module scope
                       holds the one AudioContext.
  data/songs.js        Note data, and the compact letter notation it
                       is written in ("C5 E5 G5-" — a dash lengthens).
  lib/keyboard.js      Key geometry and the typing-key map.
  lib/painting.js      Generative folk brushwork on the wooden boards.
  hooks/usePiano.js    Playing, lessons, the Listen playback.
  components/          Stage, keys, boards, control bar, lesson strip.
```

### Two things worth knowing before you edit

**The live lesson lives in a ref, not in state.** Two correct keys can
land in the same frame, and reading `idx` off state would let the
second one judge against a stale note. The ref is the source of truth
and a version counter pushes renders.

**The stage light is one gradient, not one per key.** Each key's
gradient is sized to the whole keyboard and offset by its own `--x`,
so the wash runs unbroken across the instrument instead of repeating
on every key.

## Songs

Both songs were read out of MIDI with the tool below. Add more by
appending to `SONGS` in `src/data/songs.js`.

Songs are letter notation plus optional chords:

```js
mysong: song("My Song", 92, [
  ["Verse", "C5 E5 G5- G5 F5 E5"],
  [null,    "D5 D5- C5---"],
], {
  oct: 4,                              // register the song is written in
  chords: [[36,48,52,55], [43,47,50,55]],
  at: [[0,0], [7,1]],                  // [melody note index, chord index]
})
```

A bare letter is an eighth note and each dash lengthens it. Give a
letter an octave (`C5`, `G4`) and it means exactly that pitch —
worth doing, because a `G` can sit either side of the `C`.

### Reading a song out of a MIDI file

`tools/midiread.py` needs no dependencies:

```bash
python3 tools/midiread.py song.mid                  # list the tracks
python3 tools/midiread.py song.mid --track 0 --bars 9-24
```

It prints the top voice in the same letter notation, ready to paste.
