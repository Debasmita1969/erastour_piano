import { song } from "./notation";

/* Note data read out of the source MIDI files.

   A bare letter is an eighth note and each dash lengthens it. Give a
   letter an octave (C5, G4) and it means exactly that pitch; leave it
   off and it lands in the octave above middle C. `at` pins each chord
   change to the melody note index it falls on, so the harmony moves
   with the player rather than on a clock. */
export const SONGS = {
  /* Read straight out of the MIDI: bars 9-32, quarter = 93.
     Melody is the top voice of the right hand; the chords are the
     block harmony and bass root sounding underneath it, indexed to
     the melody note they change on. */
  atw: song("All Too Well",93,[
    ["Verse"  , "C5 C5 A4 C5- C5 G4- C5"],
    [null     , "D5 D5- D5 C5---"],
    [null     , "E5 E5 E5 E5 D5- C5-"],
    [null     , "A4-- C5- C5 C5-"],
    [null     , "G4 C5 C5 C5- G4- G4 G4"],
    [null     , "D5 D5- D5- C5 E5--"],
    [null     , "A4 C5 C5 C5-- C5 C5"],
    [null     , "A4- G4 C5---"],
    [null     , "C5--- E5- D5---"],
    [null     , "B4--- E5- C5---"],
    [null     , "A4---"],
    [null     , "A4 C5--- C5 C5"],
    ["Verse 2", "C5 C5 A4 C5- G4- G4 D5"],
    [null     , "D5 D5- D5--- C5"],
    [null     , "E5 E5 E5 E5 D5- C5 C5"],
    [null     , "A4-- C5---"],
    [null     , "C5 A4 C5 C5 A4 C5- G4-"],
    [null     , "D5 D5 D5 C5 D5- C5 E5 E5-"],
    [null     , "A4 C5 C5 C5--- C5 C5"],
    [null     , "A4-- C5--- C5 C5"],
    ["Chorus" , "C5 C5 G5- D5- C5- C5"],
    [null     , "C5 C5 G5- D5- C5 C5 C5 C5"],
    [null     , "C5 C5 G5- D5- C5 C5 C5"],
    [null     , "G5- F5 F5- E5- A4---"],
  ],{
    chords:[[36,48,52,55],[43,47,50,55],[45,48,52,57],[41,48,53,57],[48,53,57,65],[36,48,60],[43,55,62],[45,57,60,64],[41,53,60,65]],
    at:[[0,0],[7,1],[11,2],[17,3],[18,4],[21,0],[28,1],[33,2],[39,3],[42,5],[45,6],[48,7],[49,8],[53,0],[60,1],[64,2],[71,3],[72,4],[73,0],[80,1],[88,2],[94,3],[95,4],[98,0],[104,1],[112,2],[119,1]]
  }),
  /* Read out of the MIDI: bars 9-24, quarter = 90. Melody is the
     voice track, so it sits where it is actually sung — an octave
     below where the letter chart put it. Chords are the piano and
     bass underneath, folded below the tune so they don't muddy it. */
  champagne: song("Champagne Problems",90,[
    ["Verse" , "C4 E4 G4 G4- F4 E4 D4 D4"],
    [null    , "E4--- C4 C4 C4"],
    [null    , "D4 E4-- D4- C4-"],
    [null    , "F3-"],
    [null    , "E4 G4 G4- F4 E4 D4"],
    [null    , "D4 E4--- C4"],
    [null    , "D4 E4- D4- C4- F3--"],
    [null    , "C4 C4 C4"],
    ["Chorus", "C4 C4 D4- C4 B3 C4"],
    [null    , "C4 C4 D4- C4 B3 C4"],
    [null    , "C4 C4 C4 D4- C4 B3 C4"],
    [null    , "F3- F3- E3- E3-"],
    [null    , "C4 C4 C4 D4- C4 B3 C4"],
    [null    , "C4 C4 C4 D4- C4 B3 C4"],
    [null    , "C4 C4 C4 D4- C4 B3 C4"],
    [null    , "F3- F3- E3- E3-"],
  ],{
    oct:3,
    chords:[[48,52,55,60],[43,55,59,62],[45,52,57,60],[41,53,57,60],[48,55,60],[43,55,60],[45,52,60],[41,53,60]],
    at:[[0,0],[8,1],[12,2],[16,3],[17,0],[23,1],[26,2],[31,3],[34,4],[40,5],[46,6],[53,7],[57,0],[64,5],[71,6],[78,7]]
  })
};

export { NAMES, seq, song } from "./notation";
