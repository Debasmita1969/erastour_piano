import { useEffect } from "react";
import { CASE_WIDTH, WK_D, BOARD, RAIL } from "../lib/keyboard";

/* Sizes and tilts the 3D rig to whatever the window is. Written
   straight onto the element as custom properties rather than held in
   state — it fires on every resize and nothing else needs to know. */
export function useStageFit(rigRef, camera) {
  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;

    const fit = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      /* Phones need the full width. Height matters separately: a
         landscape phone is wide enough to look like a desktop but is
         only ~400px tall, so a short viewport reserves less height
         whatever its width. */
      const narrow = vw < 720;
      const short = vh < 560;
      const marginX = narrow ? 14 : 56;
      const marginY = short ? 92 : narrow ? 128 : 132;
      let tilt, lift, footprint, cap;

      if (camera === "top") {
        tilt = 2; lift = short ? -10 : narrow ? -14 : -26; cap = 1.2;
        footprint = WK_D + BOARD * 0.12 + RAIL * 0.12 + 120;
      } else {
        tilt = 58; lift = short ? -14 : narrow ? -22 : -40; cap = 1.5;
        /* the tilted keybed foreshortens, but the upright boards
           keep close to their full height on screen */
        footprint =
          WK_D * Math.cos((58 * Math.PI) / 180) + BOARD * 0.86 + RAIL * 0.86 + 150;
      }

      const s = Math.max(
        0.34,
        Math.min((vw - marginX) / CASE_WIDTH, (vh - marginY) / footprint, cap)
      );
      rig.style.setProperty("--tilt", tilt + "deg");
      rig.style.setProperty("--lift", lift + "px");
      rig.style.setProperty("--s", s.toFixed(3));
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [rigRef, camera]);
}
