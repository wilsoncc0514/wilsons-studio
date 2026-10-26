"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/data/projects";
import { demoPalettes, toolDemoCopy, type ToolDemoKind } from "@/data/tool-demos";
import { ToolComposition } from "./tool-composition";

export function CreativeToolDemo({ lang, kind = "palette" }: { lang: Locale; kind?: ToolDemoKind }) {
  const [step, setStep] = useState(2);
  const [palette, setPalette] = useState(0);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const id = useId();
  const copy = toolDemoCopy[kind][lang];
  const zh = lang === "zh";
  const colors = demoPalettes[palette].colors;
  const cancel = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const stop = useCallback(() => { cancel(); setPlaying(false); }, [cancel]);
  const play = useCallback(() => {
    cancel();
    setStep(0);
    setPlaying(true);
    timers.current = [
      window.setTimeout(() => setStep(1), 1200),
      window.setTimeout(() => { setStep(2); setPlaying(false); timers.current = []; }, 2400),
    ];
  }, [cancel]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let shown = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { stop(); return; }
      if (!shown) {
        shown = true;
        if (!reduced.matches && fine.matches && !document.hidden) play();
      }
    }, { threshold: 0.35 });
    observer.observe(element);
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", stop);
    return () => {
      cancel();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", stop);
    };
  }, [cancel, play, stop]);

  const selectStep = (value: number) => { stop(); setStep(value); };
  return <article className="tool-demo" ref={root} data-step={step} data-kind={kind} data-playing={playing} aria-labelledby={`${id}-title`}>
    <header className="tool-demo-header">
      <div><span className="tool-demo-label">{zh ? "交互原型" : "Interactive prototype"}</span><h3 id={`${id}-title`}>{copy.title}</h3></div>
      <button className="demo-play" type="button" aria-pressed={playing} onClick={playing ? stop : play}>{playing ? (zh ? "暂停演示" : "Pause") : (zh ? "播放过程" : "Play walkthrough")}<span aria-hidden="true">{playing ? " Ⅱ" : " ▷"}</span></button>
    </header>
    <div className="tool-demo-body">
      <div className="demo-reference">
        <div className="demo-photo"><Image src="/images/demos/cobalt-glass.webp" alt={zh ? "钴蓝玻璃瓶、石材与金属的 AI 生成参考素材" : "AI-generated reference of cobalt glass, stone, and metal"} width={1440} height={1080} sizes="(max-width: 800px) 100vw, 360px"/></div>
        <div className="demo-reference-caption"><span>{zh ? "参考素材" : "Reference"}</span><span>{zh ? "AI 生成" : "AI generated"}</span></div>
        <div className="demo-swatches" aria-label={zh ? "示例色板" : "Sample palette"}>{colors.map(color => <div key={color}><i style={{ background: color }}/><span>{color}</span></div>)}</div>
        <div className="demo-palette-options" role="group" aria-label={zh ? "预设方向" : "Preset direction"}>{demoPalettes.map((item, index) => <button type="button" key={item.name.en} aria-pressed={palette === index} onClick={() => { stop(); setPalette(index); setStep(2); }}>{item.name[lang]}</button>)}</div>
      </div>
      <ToolComposition lang={lang} kind={kind} palette={palette}/>
    </div>
    <div className="demo-step-controls" role="group" aria-label={zh ? "演示步骤" : "Walkthrough steps"}>{copy.steps.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => selectStep(index)}><span aria-hidden="true">0{index + 1}</span>{label}<span className="demo-step-dot" aria-hidden="true"/></button>)}</div>
    <p className="demo-step-story" role="status" aria-live="polite">{copy.stories[step]}</p>
    <p className="demo-disclosure">{zh ? "概念演示使用示例素材与预设色板，不提供图片上传或自动提取服务。" : "A concept demonstration using sample imagery and preset palettes. Image upload and automatic extraction are not available."}</p>
  </article>;
}
