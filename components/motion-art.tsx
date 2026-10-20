"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/projects";

const POINTS = 1500;
const FRAME_MS = 1000 / 30;

export function MotionArt({ lang }: { lang: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [orbit, setOrbit] = useState(false);
  const morph = useRef(0);

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    const ctx = surface?.getContext("2d");
    if (!element || !surface || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, frame = 0, last = 0, time = 0, blend = morph.current;
    let visible = false;
    const pointer = { x: 0, y: 0 };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const size = Math.min(width * 0.9, height * 0.76);
      const rotation = 0.42 + Math.sin(time * 0.23) * 0.25 + pointer.x * 0.4;
      const tilt = pointer.y * 0.16;
      const count = width < 500 ? 900 : POINTS;
      for (let i = 0; i < count; i++) {
        const u = (i % 150) / 149;
        const layer = Math.floor(i / 150);
        // Four connected strokes form the studio's W; depth makes a folded ribbon.
        const segment = Math.min(3, Math.floor(u * 4));
        const local = u * 4 - segment;
        const ys = [-0.48, 0.48, -0.15, 0.48, -0.48];
        const wx = u - 0.5 + (layer / (count / 150) - 0.5) * 0.09;
        const wy = ys[segment] + (ys[segment + 1] - ys[segment]) * local;
        const wz = (layer / (count / 150) - 0.5) * 0.5;
        const a = i * 2.399963;
        const sy = 1 - (i / (count - 1)) * 2;
        const radius = Math.sqrt(1 - sy * sy) * 0.52;
        const x = wx * (1 - blend) + Math.cos(a + time * 0.16) * radius * blend;
        const y = wy * (1 - blend) + sy * 0.52 * blend;
        const z = wz * (1 - blend) + Math.sin(a + time * 0.16) * radius * blend;
        const rx = x * Math.cos(rotation) + z * Math.sin(rotation);
        const rz = -x * Math.sin(rotation) + z * Math.cos(rotation);
        const wave = Math.sin(u * 11 + time * 0.7 + layer * 0.22) * 0.028;
        const depth = 1 + rz * 0.28;
        const px = width / 2 + rx * size * depth;
        const py = height / 2 + (y + wave + rz * tilt) * size * depth;
        ctx.fillStyle = layer % 3 === 0 ? `rgba(179,201,255,${0.5 + rz * 0.35})` : `rgba(96,139,255,${0.65 + rz * 0.35})`;
        ctx.beginPath();
        ctx.arc(px, py, (width < 500 ? 1 : 1.2) * depth, 0, Math.PI * 2);
        ctx.fill();
      }
      element.dataset.rendered = "true";
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - last >= FRAME_MS) {
        time += Math.min((now - last) / 1000, 0.05);
        last = now;
        blend += ((orbit ? 1 : 0) - blend) * 0.065;
        morph.current = blend;
        draw();
      }
      if (!paused && !reduce.matches) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (paused || reduce.matches) { blend = orbit ? 1 : 0; morph.current = blend; draw(); }
      else if (visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    resize.observe(surface);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); });
    observer.observe(element);
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = surface.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => { pointer.x = 0; pointer.y = 0; };
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", start);
    reduce.addEventListener("change", start);
    start();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", start);
      reduce.removeEventListener("change", start);
    };
  }, [paused, orbit]);

  return <div className="motion-art" ref={host}>
    <div className="motion-art-top"><span>W / FORM STUDY</span><span>{lang === "zh" ? "实时生成" : "Live composition"}</span></div>
    <div className="motion-art-stage" role="img" aria-label={lang === "zh" ? "蓝色立体点云组成 W 字形，可切换成球体" : "A blue three-dimensional point cloud forms a W or a sphere"}>
      <svg className="motion-art-poster" viewBox="0 0 500 450" aria-hidden="true"><path d="M65 90 160 360 250 185 340 360 435 90" fill="none" stroke="#7898ff" strokeWidth="20" strokeLinejoin="round" strokeDasharray="1 7" strokeLinecap="round"/></svg>
      <canvas ref={canvas} aria-hidden="true"/>
    </div>
    <div className="motion-art-bottom"><div><strong translate="no">Wilson’s Studio</strong><span>{lang === "zh" ? "从想象，到成形。" : "Imagination, taking shape."}</span></div><div className="art-controls">
      <button type="button" aria-pressed={orbit} onClick={() => setOrbit(!orbit)}>{lang === "zh" ? "变形" : "Reshape"}<span aria-hidden="true"> ↗</span></button>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} aria-label={lang === "zh" ? (paused ? "播放主视觉动画" : "暂停主视觉动画") : (paused ? "Play visual animation" : "Pause visual animation")}>{paused ? "▷" : "Ⅱ"}</button>
    </div></div>
  </div>;
}
