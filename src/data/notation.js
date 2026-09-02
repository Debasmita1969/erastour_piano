/* The compact letter notation songs are written in. */

/* ══ Songs ═════════════════════════════════════════════════════
   Short melodic hooks only, kept as note data — pitch plus length
   in beats. Lengths are used for the strip and the Listen demo;
   the lesson itself waits for you and never runs on a clock.
   Both hooks are transposed to sit inside the visible C4–C6 range. */
var NAMES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

/* Letter notation → notes. A bare letter is an eighth; each
   trailing dash lengthens it (C, C-, C--, C---).

   Give a letter an octave number — C5, G4 — and it means exactly
   that pitch. Leave it off and the note lands in the octave above
   middle C, with A and B falling to the two notes *below* that C.
   That shorthand suits a letter chart, where the tune sits in one
   hand position; anything read off a score gets explicit octaves,
   since a G can be on either side of the C. */
var STEP={C:0,D:2,E:4,F:5,G:7,A:9,B:11}, LEN=[.5,1,1.5,2];
function seq(str){
  return str.trim().split(/\s+/).map(function(tok){
    var t=/^([A-G])(#|b)?(\d)?(-{0,3})$/.exec(tok);
    var s=STEP[t[1]]+(t[2]==="#"?1:t[2]==="b"?-1:0);
    return {
      m: t[3] ? (Number(t[3])+1)*12+s : 72+s-(s>=9?12:0),
      d: LEN[t[4].length]
    };
  });
}
function song(name,tempo,parts,extra){
  var notes=[];
  parts.forEach(function(p){
    var ns=seq(p[1]);
    if(ns.length && p[0]) ns[0].s=p[0];
    notes=notes.concat(ns);
  });
  var o={name:name,tempo:tempo,notes:notes};
  for(var k in (extra||{})) o[k]=extra[k];
  return o;
}

export { NAMES, seq, song };
