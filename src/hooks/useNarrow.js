import { useEffect, useState } from "react";

/* True on phone-width screens. Used to show fewer note chips, since
   eight of them do not fit across a phone. */
export function useNarrow(query = "(max-width: 720px)") {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = (e) => setNarrow(e.matches);
    mq.addEventListener("change", on);
    setNarrow(mq.matches);
    return () => mq.removeEventListener("change", on);
  }, [query]);

  return narrow;
}
