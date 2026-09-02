/* Generated walnut.

   The old boards were repeating-linear-gradient stripes, which read
   exactly like corduroy. Real wood has three things stripes cannot
   fake: growth rings that wander, fine fibre running lengthwise, and
   colour that drifts across the board. All three are noise, so the
   grain is painted per surface on a canvas. */

/* cheap 2D value noise — hash the lattice, smoothstep between */
function hash(x, y, seed) {
  let h = x * 374761393 + y * 668265263 + seed * 69069;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function smooth(t) { return t * t * (3 - 2 * t); }

function noise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  return (a + (b - a) * xf) + ((c + (d - c) * xf) - (a + (b - a) * xf)) * yf;
}

function fbm(x, y, seed, octaves = 4) {
  let sum = 0, amp = 0.5, fx = x, fy = y;
  for (let o = 0; o < octaves; o++) {
    sum += noise(fx, fy, seed + o * 101) * amp;
    fx *= 2; fy *= 2; amp *= 0.5;
  }
  return sum;
}

const RAMP = [
  [0.00, 26, 14, 8],       /* deepest between rings */
  [0.35, 58, 33, 18],
  [0.62, 96, 58, 32],
  [0.85, 132, 84, 48],
  [1.00, 158, 106, 62],    /* where the lamp catches the figure */
];
function ramp(t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < RAMP.length; i++) {
    if (t <= RAMP[i][0]) {
      const [p0, r0, g0, b0] = RAMP[i - 1], [p1, r1, g1, b1] = RAMP[i];
      const k = (t - p0) / (p1 - p0);
      return [r0 + (r1 - r0) * k, g0 + (g1 - g0) * k, b0 + (b1 - b0) * k];
    }
  }
  return RAMP[RAMP.length - 1].slice(1);
}

/* `lamp` biases brightness toward the light, which sits house-left.
   `figure` adds the wide cathedral pattern boards show near the
   centre; end blocks get none, since they are cut across. */
export function paintWood(canvas, w, h, seed, opts = {}) {
  const { lamp = 1, figure = 1, dark = 0 } = opts;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cw = Math.max(1, Math.round(w * dpr));
  const ch = Math.max(1, Math.round(h * dpr));
  canvas.width = cw; canvas.height = ch;
  canvas.style.width = w + "px"; canvas.style.height = h + "px";

  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(cw, ch);
  const px = img.data;

  for (let y = 0; y < ch; y++) {
    const v = y / dpr, ny = v / h;
    for (let x = 0; x < cw; x++) {
      const u = x / dpr;

      /* grain wanders slowly along the board and quickly across it */
      const drift = fbm(u * 0.004, v * 0.02, seed) - 0.5;
      const rings = 0.5 + 0.5 * Math.sin((v * 0.075 + drift * 9) * Math.PI);
      /* the wide figure that opens up near the middle of a board */
      const cath = figure
        ? Math.pow(1 - Math.abs(ny - 0.5) * 2, 2) *
          (0.5 + 0.5 * Math.sin((v * 0.02 + drift * 4) * Math.PI))
        : 0;
      /* fine fibre, stretched hard along the length */
      const fibre = fbm(u * 0.9, v * 0.012, seed + 7);

      let t = 0.30 + rings * 0.30 + cath * 0.22 * figure + (fibre - 0.5) * 0.14;
      t -= dark;
      /* light falls off from house-left across the whole instrument */
      t *= 1 - lamp * 0.30 * (u / w);

      const [r, g, b] = ramp(t);
      const i = (y * cw + x) * 4;
      px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}
