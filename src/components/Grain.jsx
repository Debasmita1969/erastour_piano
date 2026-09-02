import { useEffect, useRef } from "react";

/* Film grain over the room — it keeps the big flat gradients from
   banding. Drawn at half resolution and scaled up. */
export default function Grain() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    let timer;

    const draw = () => {
      const w = Math.ceil(window.innerWidth / 2);
      const h = Math.ceil(window.innerHeight / 2);
      c.width = w; c.height = h;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      const ctx = c.getContext("2d");
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = d[i + 1] = d[i + 2] = (200 + Math.random() * 55) | 0;
        d[i + 3] = 26;
      }
      ctx.putImageData(img, 0, 0);
    };

    const onResize = () => { clearTimeout(timer); timer = setTimeout(draw, 180); };
    draw();
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(timer); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas id="grain" ref={ref} />;
}
