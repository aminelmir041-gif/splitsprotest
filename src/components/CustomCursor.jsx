import { useEffect, useRef, useState } from "react";

export const CustomCursor = () => {
  const ring = useRef(null);
  const dot = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    let rx = 0, ry = 0, dx = 0, dy = 0, raf;

    const onMove = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      const t = e.target;
      const interactive = t.closest("a, button, [role=button], input, textarea, select, [data-cursor]");
      if (ring.current) ring.current.classList.toggle("hovering", !!interactive);
    };
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="sp-cursor" aria-hidden />
      <div ref={dot} className="sp-cursor-dot" aria-hidden />
    </>
  );
};

export default CustomCursor;
