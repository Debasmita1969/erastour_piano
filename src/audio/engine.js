/* Web Audio synth and backing pad. Module scope holds the single
   AudioContext, which is what you want for audio anyway. */

/* ══ Sound ═════════════════════════════════════════════════════ */
var ac=null, master=null, bus=null, voices=Object.create(null);
var volume=.72, sustain=false, voiceName="upright";

/* Warmer than before: the cutoffs were letting far too much top
   through, which is what made every note read as thin and shrill.
   Now the fundamental and its octave below carry the sound. */
var VOICES={
  upright:{a:"triangle",b:"sine",det:-5,sub:true, cut:[1900,300],decay:3.0,hold:.34,gain:.34},
  glass:  {a:"sine",    b:"sine",det:7, sub:true, cut:[2600,900],decay:4.2,hold:.42,gain:.30},
  neon:   {a:"square",  b:"triangle",det:-6,sub:true,cut:[1500,520],decay:1.8,hold:.50,gain:.20},
  reed:   {a:"sawtooth",b:"triangle",det:4,sub:false,cut:[1300,480],decay:2.2,hold:.58,gain:.20}
};

function audio(){
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)();
    master=ac.createGain(); master.gain.value=volume;
    var comp=ac.createDynamicsCompressor();
    comp.threshold.value=-14; comp.knee.value=22; comp.ratio.value=6;
    /* body in, glare out — the tone control that stops the synth
       sounding like a whistle */
    var low=ac.createBiquadFilter();
    low.type="lowshelf"; low.frequency.value=240; low.gain.value=4.5;
    var air=ac.createBiquadFilter();
    air.type="highshelf"; air.frequency.value=2600; air.gain.value=-9;
    bus=ac.createGain(); bus.gain.value=1;
    bus.connect(low); low.connect(air); air.connect(comp);
    comp.connect(master); master.connect(ac.destination);
  }
  if(ac.state==="suspended") ac.resume();
  return ac;
}
function freq(m){ return 440*Math.pow(2,(m-69)/12); }

function noteOn(midi,vel){
  audio();
  if(voices[midi]) kill(midi,true);
  var V=VOICES[voiceName], t=ac.currentTime, f=freq(midi);
  var peak=V.gain*(0.45+vel*0.75);

  var g=ac.createGain();
  var lp=ac.createBiquadFilter();
  lp.type="lowpass"; lp.Q.value=0.7;
  lp.frequency.setValueAtTime(V.cut[0]*(0.55+vel*0.6),t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(180,V.cut[1]),t+V.decay*0.8);

  var o1=ac.createOscillator(); o1.type=V.a; o1.frequency.value=f;
  var o2=ac.createOscillator(); o2.type=V.b; o2.frequency.value=f; o2.detune.value=V.det;
  var g2=ac.createGain(); g2.gain.value=.38;
  o1.connect(g); o2.connect(g2); g2.connect(g);

  var o3=null;
  if(V.sub){
    o3=ac.createOscillator(); o3.type="sine"; o3.frequency.value=f/2;
    var g3=ac.createGain(); g3.gain.value=.62;
    o3.connect(g3); g3.connect(g);
  }

  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(peak,t+.014);
  g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak*V.hold),t+.32);
  g.gain.exponentialRampToValueAtTime(.0002,t+V.decay);

  g.connect(lp); lp.connect(bus);
  o1.start(t); o2.start(t); if(o3) o3.start(t);
  voices[midi]={g:g,os:[o1,o2].concat(o3?[o3]:[]),dieAt:t+V.decay+.1};
}

function kill(midi,now){
  var v=voices[midi]; if(!v) return;
  delete voices[midi];
  var t=ac.currentTime, tail=now?.015:(sustain?1.6:.20);
  try{
    v.g.gain.cancelScheduledValues(t);
    v.g.gain.setValueAtTime(Math.max(v.g.gain.value,.0002),t);
    v.g.gain.exponentialRampToValueAtTime(.0002,t+tail);
  }catch(e){}
  v.os.forEach(function(o){ try{o.stop(t+tail+.03);}catch(e){} });
}
/* The backing: root, chord tones and a bass octave held under the
   melody. Soft, dark and low, so it fills the bottom the melody
   alone was missing without ever competing with it. */
var pad=null, backing=true;
function playChord(midis){
  if(!backing || !midis || !midis.length) return;
  audio();
  stopPad(true);
  var t=ac.currentTime;
  var g=ac.createGain(), lp=ac.createBiquadFilter();
  lp.type="lowpass"; lp.frequency.value=760; lp.Q.value=.5;
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(.13,t+.09);
  g.gain.setTargetAtTime(.075,t+.25,.8);
  var os=midis.slice(0,4).map(function(m,i){
    var o=ac.createOscillator();
    o.type = i===0 ? "sine" : "triangle";
    o.frequency.value=freq(m);
    o.detune.value = i%2 ? 5 : -5;
    o.connect(g); o.start(t);
    return o;
  });
  g.connect(lp); lp.connect(bus);
  pad={g:g,os:os};
}
function stopPad(fast){
  if(!pad) return;
  var p=pad; pad=null;
  var t=ac.currentTime, tail=fast?.06:.55;
  try{
    p.g.gain.cancelScheduledValues(t);
    p.g.gain.setValueAtTime(Math.max(p.g.gain.value,.0002),t);
    p.g.gain.exponentialRampToValueAtTime(.0002,t+tail);
  }catch(e){}
  p.os.forEach(function(o){ try{o.stop(t+tail+.05);}catch(e){} });
}

function allOff(){
  stopPad(true);
  for(var k in voices) kill(k,true);
  Array.prototype.forEach.call(document.querySelectorAll(".key.down"),function(el){el.classList.remove("down");});
}


/* ── iPhone ───────────────────────────────────────────────────────
   Two things silence Web Audio on iOS that are not faults in the
   page, which is why the keys still animate:

   1. The context starts suspended and only a real user gesture may
      resume it. iOS also suspends it again when the page goes to the
      background, and it does not come back on its own.
   2. The page's audio session defaults to a category the hardware
      ringer switch mutes. iOS 16.4+ lets us ask for "playback",
      which ignores the switch; older versions need a looping silent
      element to move the session for us.

   All of it has to happen inside the gesture, so this runs on the
   first touch anywhere on the page. */
let unlocked = false, silentEl = null;

function silentWavUrl() {
  const rate = 8000, frames = rate / 2;
  const buf = new ArrayBuffer(44 + frames * 2);
  const view = new DataView(buf);
  const tag = (at, s) => { for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i)); };
  tag(0, "RIFF"); view.setUint32(4, 36 + frames * 2, true);
  tag(8, "WAVE"); tag(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  tag(36, "data"); view.setUint32(40, frames * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

export function unlockAudio() {
  const ctx = audio();                    /* created and resumed in the gesture */
  if (unlocked) return ctx;
  unlocked = true;

  try {
    if (navigator.audioSession) navigator.audioSession.type = "playback";
  } catch { /* not supported, the silent element covers it */ }

  try {
    silentEl = new Audio(silentWavUrl());
    silentEl.loop = true;
    silentEl.playsInline = true;
    silentEl.play().catch(() => {});
  } catch { /* nothing more we can do */ }

  try {                                   /* a zero-length buffer wakes the graph */
    const src = ctx.createBufferSource();
    src.buffer = ctx.createBuffer(1, 1, 22050);
    src.connect(ctx.destination);
    src.start(0);
  } catch { /* harmless */ }

  return ctx;
}

/* iOS suspends the context when the page is backgrounded */
export function resumeAudio() {
  if (ac && ac.state !== "running") ac.resume().catch(() => {});
}

export function setVolume(v) {
  volume = v;
  if (master) master.gain.setTargetAtTime(v, ac.currentTime, 0.02);
}
export function setSustain(on) { sustain = on; }
export function setVoice(v) { voiceName = v; }
export function setBacking(on) { backing = on; if (!on) stopPad(); }
export { noteOn, kill, allOff, playChord, stopPad, freq };
