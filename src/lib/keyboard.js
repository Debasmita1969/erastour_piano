/* Keyboard geometry and layout. All sizes are in the unscaled space
   the 3D rig is built in; the stage scales the whole thing to fit. */

export const WK_W = 56, WK_GAP = 2, WK_D = 246, WK_H = 19;
export const BK_W = 34, BK_D = 154, BK_H = 31;
export const CHEEK = 36, BOARD = 136, RAIL = 88;
export const WHITE = 15;

export const KB_WIDTH = WHITE * WK_W + (WHITE - 1) * WK_GAP;
export const CASE_WIDTH = KB_WIDTH + CHEEK * 2;

const PATTERN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/* Home row walks the white keys, the row above takes the sharps; the
   last three carry on past the home row so the upper octave is
   reachable too. */
export const TYPED = [
  "a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u",
  "j", "k", "o", "l", "p", ";", "'", "[", "]", "\\",
];

export function noteName(m) {
  return PATTERN[m % 12] + (Math.floor(m / 12) - 1);
}

/* Lay out one keyboard starting at C of the given octave. Returns the
   white and black keys separately so whites can paint first, plus the
   typing-key lookup. */
export function buildLayout(baseOctave) {
  const start = (baseOctave + 1) * 12;

  const whiteSemis = [];
  for (let s = 0; whiteSemis.length < WHITE; s++) {
    if (!PATTERN[s % 12].includes("#")) whiteSemis.push(s);
  }
  const lastWhite = whiteSemis[whiteSemis.length - 1];

  const white = whiteSemis.map((semi, i) => ({
    midi: start + semi,
    black: false,
    x: i * (WK_W + WK_GAP),
  }));

  const black = [];
  for (let semi = 0; semi <= lastWhite; semi++) {
    if (!PATTERN[semi % 12].includes("#")) continue;
    const leftIdx = whiteSemis.indexOf(semi - 1);
    black.push({
      midi: start + semi,
      black: true,
      x: (leftIdx + 1) * (WK_W + WK_GAP) - BK_W / 2 - WK_GAP / 2,
    });
  }

  /* letters go on in pitch order, whites and sharps interleaved */
  const byChar = {};
  [...white, ...black]
    .sort((a, b) => a.midi - b.midi)
    .forEach((key, i) => {
      const ch = TYPED[i];
      if (!ch) return;
      byChar[ch] = key.midi;
      key.letter = ch === ";" || ch === "'" ? ch : ch.toUpperCase();
    });

  return { white, black, byChar };
}
