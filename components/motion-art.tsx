"use client";

import { useEffect, useRef } from "react";

// Geometry is immutable: the frame loop only projects points and submits two paths.
const FRAME_MS = 1000 / 24;
const MAX_PIXELS = 900_000;
function makePoints(columns: number, layers: number) {
  const points = [];
  const heights = [-0.48, 0.48, -0.15, 0.48, -0.48];
  for (let layer = 0; layer < layers; layer++) {
    for (let i = 0; i < columns; i++) {
      const u = i / (columns - 1);
      const segment = Math.min(3, Math.floor(u * 4));
      const local = u * 4 - segment;
      const phase = u * 11 + layer * 0.22;
      points.push({
        x: u - 0.5 + (layer / layers - 0.5) * 0.09,
        y: heights[segment] + (heights[segment + 1] - heights[segment]) * local,
        z: (layer / layers - 0.5) * 0.5,
        sin: Math.sin(phase),
        cos: Math.cos(phase),
        group: layer % 3 === 0 ? 0 : 1,
      });
    }
  }
  return points;
}
const desktopPoints = makePoints(120, 7);
const mobilePoints = makePoints(90, 4);

export function MotionArt() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    const ctx = surface?.getContext("2d");
    if (!element || !surface || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    let width = 1, height = 1, frame = 0, last = 0, time = 0;
    let runUntil = 0, scrolling = false, scrollTimer = 0, disposed = false;
    const pointer = { x: 0, y: 0 };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const points = width < 700 || coarse.matches ? mobilePoints : desktopPoints;
      const size = Math.min(width * 1.05, height * 0.95);
      const rotation = 0.42 + Math.sin(time * 0.23) * 0.12 + pointer.x * 0.2;
      const sin = Math.sin(rotation), cos = Math.cos(rotation);
      const waveSin = Math.sin(time * 0.7), waveCos = Math.cos(time * 0.7);
      for (let group = 0; group < 2; group++) {
        ctx.fillStyle = group === 0 ? "#4569ad" : "#315df4";
        ctx.beginPath();
        for (const point of points) {
          if (point.group !== group) continue;
          const rx = point.x * cos + point.z * sin;
          const rz = -point.x * sin + point.z * cos;
          const depth = 1 + rz * 0.28;
          const wave = (point.sin * waveCos + point.cos * waveSin) * 0.022;
          const x = width * 0.55 + rx * size * depth;
          const y = height * 0.52 + (point.y + wave + rz * pointer.y * 0.1) * size * depth;
          const radius = (width < 700 ? 1.05 : 1.35) * depth;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      element.dataset.rendered = "true";
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || document.hidden || reduce.matches || scrolling) return;
      if (now - last >= FRAME_MS) {
        time += Math.min((now - last) / 1000, 0.08);
        last = now;
        draw();
      }
      if (now < runUntil) frame = requestAnimationFrame(tick);
    };
    const animate = (duration: number) => {
      if (disposed || reduce.matches || coarse.matches || document.hidden || scrolling) return;
      runUntil = performance.now() + duration;
      if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const resize = new ResizeObserver(([entry]) => {
      width = Math.max(1, entry.contentRect.width);
      height = Math.max(1, entry.contentRect.height);
      // A full-screen decorative canvas does not need retina-sized backing storage.
      const dpr = Math.min(1, Math.sqrt(MAX_PIXELS / (width * height)));
      surface.width = Math.max(1, Math.round(width * dpr));
      surface.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    resize.observe(element);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.buttons || scrolling) { stop(); return; }
      pointer.x = event.clientX / width - 0.5;
      pointer.y = event.clientY / height - 0.5;
      animate(450);
    };
    const scroll = () => {
      scrolling = true;
      stop();
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { scrolling = false; }, 160);
    };
    const suspend = () => stop();
    const preference = () => { stop(); draw(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", suspend, { passive: true });
    document.addEventListener("visibilitychange", suspend);
    window.addEventListener("scroll", scroll, { passive: true });
    reduce.addEventListener("change", preference);
    coarse.addEventListener("change", preference);
    // One bounded entrance, then demand-driven motion; scrolling never competes with it.
    animate(4000);
    return () => {
      disposed = true;
      stop();
      clearTimeout(scrollTimer);
      resize.disconnect();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", suspend);
      document.removeEventListener("visibilitychange", suspend);
      window.removeEventListener("scroll", scroll);
      reduce.removeEventListener("change", preference);
      coarse.removeEventListener("change", preference);
    };
  }, []);

  return <div className="motion-art" ref={host} aria-hidden="true">
    <svg className="motion-art-poster" viewBox="0 0 500 450" preserveAspectRatio="xMidYMid slice"><path d="M65 90 160 360 250 185 340 360 435 90" fill="none" stroke="currentColor" strokeWidth="20" strokeLinejoin="round" strokeDasharray="1 7" strokeLinecap="round"/></svg>
    <canvas ref={canvas}/>
  </div>;
}
