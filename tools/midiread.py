#!/usr/bin/env python3
"""Read a Standard MIDI File and print it as the piano's letter notation.

No dependencies — SMF is a simple chunked binary format.

  python3 midiread.py song.mid                 # list the tracks
  python3 midiread.py song.mid --track 1       # dump one track
  python3 midiread.py song.mid --track 1 --bars 9-16
"""
import sys, struct

NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


def vlq(data, i):
    """Variable-length quantity: 7 bits per byte, high bit = continue."""
    n = 0
    while True:
        b = data[i]; i += 1
        n = (n << 7) | (b & 0x7F)
        if not b & 0x80:
            return n, i


def read(path):
    raw = open(path, "rb").read()
    if raw[:4] != b"MThd":
        raise SystemExit("not a MIDI file (no MThd header)")
    _, fmt, ntrks, div = struct.unpack(">IHHH", raw[4:14])
    i, tracks, tempos = 14, [], []

    while i < len(raw) and len(tracks) < ntrks:
        if raw[i:i + 4] != b"MTrk":
            break
        length = struct.unpack(">I", raw[i + 4:i + 8])[0]
        body, i = raw[i + 8:i + 8 + length], i + 8 + length

        j, t, status, notes, on, name = 0, 0, None, [], {}, ""
        while j < len(body):
            delta, j = vlq(body, j)
            t += delta
            b = body[j]
            if b & 0x80:
                status, j = b, j + 1
            ev, ch = status & 0xF0, status & 0x0F

            if b == 0xFF:                                  # meta
                mtype = body[j]; j += 1
                mlen, j = vlq(body, j)
                data, j = body[j:j + mlen], j + mlen
                if mtype == 0x03:
                    name = data.decode("latin-1", "replace")
                elif mtype == 0x51:
                    tempos.append((t, struct.unpack(">I", b"\0" + data)[0]))
                status = None
            elif b in (0xF0, 0xF7):                        # sysex
                mlen, j = vlq(body, j + 1)
                j += mlen
                status = None
            elif ev in (0x80, 0x90):
                pitch, vel, j = body[j], body[j + 1], j + 2
                if ev == 0x90 and vel:
                    on.setdefault(pitch, []).append(t)
                elif on.get(pitch):                        # note off
                    notes.append((on[pitch].pop(0), t, pitch, ch))
            elif ev in (0xA0, 0xB0, 0xE0):
                j += 2
            elif ev in (0xC0, 0xD0):
                j += 1
            else:
                j += 1

        notes.sort()
        tracks.append({"name": name, "notes": notes})

    bpm = round(60_000_000 / tempos[0][1]) if tempos else None
    return div, bpm, tracks


def melody(notes):
    """Top voice: at each onset keep only the highest sounding note."""
    out, i = [], 0
    while i < len(notes):
        start = notes[i][0]
        group = [n for n in notes if n[0] == start]
        out.append(max(group, key=lambda n: n[2]))
        i += len(group)
    return out


def letters(notes, div, octaves=False):
    """Render as 'C E G-' — a dash per extra eighth, capped at 4.
    With octaves=True, writes the octave number too (C5, G4)."""
    toks = []
    for k, (start, end, pitch, _) in enumerate(notes):
        gap = (notes[k + 1][0] - start) if k + 1 < len(notes) else (end - start)
        eighths = max(1, min(4, round(gap / (div / 2))))
        name = NAMES[pitch % 12] + (str(pitch // 12 - 1) if octaves else "")
        toks.append(name + "-" * (eighths - 1))
    return " ".join(toks)


def main():
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    path = args[0]
    track = int(args[args.index("--track") + 1]) if "--track" in args else None
    bars = args[args.index("--bars") + 1] if "--bars" in args else None

    div, bpm, tracks = read(path)
    print(f"ticks/quarter: {div}   tempo: {bpm or '?'} bpm   tracks: {len(tracks)}\n")

    for n, tr in enumerate(tracks):
        ns = tr["notes"]
        if not ns:
            print(f"  [{n}] {tr['name'] or '(unnamed)'} — no notes")
            continue
        pitches = [x[2] for x in ns]
        span = f"{NAMES[min(pitches)%12]}{min(pitches)//12-1}–{NAMES[max(pitches)%12]}{max(pitches)//12-1}"
        bars_n = ns[-1][1] / (div * 4)
        print(f"  [{n}] {tr['name'] or '(unnamed)'} — {len(ns)} notes, "
              f"{span}, ~{bars_n:.0f} bars")

    if track is None:
        print("\nPick one with --track N")
        return

    ns = melody(tracks[track]["notes"])
    if bars:
        a, b = (int(x) for x in bars.split("-"))
        lo_t, hi_t = (a - 1) * div * 4, b * div * 4
        ns = [x for x in ns if lo_t <= x[0] < hi_t]

    pitches = [x[2] for x in ns]
    print(f"\ntrack {track}: {len(ns)} melody notes, "
          f"MIDI {min(pitches)}–{max(pitches)}\n")
    print(letters(ns, div, min(pitches), max(pitches)))


if __name__ == "__main__":
    main()
