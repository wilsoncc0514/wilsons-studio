"use client";

import Image from "next/image";
import { useId, useRef, type CSSProperties } from "react";
import type { Locale } from "@/data/projects";

type ComparisonProps = {
  lang: Locale;
  afterSrc?: string;
  beforeSrc?: string;
  title?: string;
};

export function ImageComparison({ lang, afterSrc, beforeSrc, title }: ComparisonProps) {
  const figure = useRef<HTMLElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const id = useId();
  const demo = !beforeSrc || !afterSrc;
  const zh = lang === "zh";
  const imageSrc = demo ? "/images/demos/cobalt-glass.webp" : afterSrc;
  const imageAlt = demo ? (zh ? "蓝色玻璃瓶与金属的 AI 生成演示图" : "AI-generated study of cobalt glass and metal") : (title ?? "");
  const update = (position: number) => {
    figure.current?.style.setProperty("--split", `${position}%`);
    slider.current?.setAttribute("aria-valuetext", zh ? `调整前显示 ${position}%` : `${position}% before visible`);
  };
  return <figure ref={figure} className="comparison" style={{ "--split": "50%" } as CSSProperties}>
    <div className="comparison-stage">
      <Image className="comparison-image" src={imageSrc} alt={imageAlt} width={1440} height={1080} sizes="(max-width: 1240px) 100vw, 1176px" draggable={false}/>
      <div className="comparison-before" aria-hidden="true">
        <Image className="comparison-image" src={demo ? "/images/demos/cobalt-glass-before.webp" : beforeSrc} alt="" width={1440} height={1080} sizes="(max-width: 1240px) 100vw, 1176px" draggable={false}/>
      </div>
      <span className="comparison-tag comparison-tag-before" aria-hidden="true">{demo ? (zh ? "模拟调整前" : "Simulated before") : (zh ? "原图" : "Before")}</span>
      <span className="comparison-tag comparison-tag-after" aria-hidden="true">{zh ? "调整后" : "After"}</span>
      <div className="comparison-divider" aria-hidden="true"><span>‹ ›</span></div>
      <input
        id={`${id}-range`}
        ref={slider}
        type="range" min="0" max="100" step="1" defaultValue={50}
        aria-label={zh ? "拖动对比图像调整前后" : "Compare before and after"}
        aria-valuetext={zh ? "调整前显示 50%" : "50% before visible"}
        aria-describedby={`${id}-caption`}
        onInput={(event) => update(Number(event.currentTarget.value))}
      />
    </div>
    <figcaption id={`${id}-caption`}>
      <p>{demo ? (zh ? "AI 生成素材，模拟色彩与对比度变化，非真实案例。" : "AI-generated sample with simulated color and contrast changes; not a client case.") : (zh ? "拖动分割线或使用键盘方向键对比原图与成片。" : "Drag the divider or use the arrow keys to compare.")}</p>
      <button type="button" onClick={() => { if (slider.current) slider.current.value = "50"; update(50); }}>{zh ? "重置对比" : "Reset view"}<span aria-hidden="true"> ↺</span></button>
    </figcaption>
  </figure>;
}
