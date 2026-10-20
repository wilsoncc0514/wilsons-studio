"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties } from "react";
import type { Locale } from "@/data/projects";

type ComparisonProps = {
  lang: Locale;
  afterSrc: string;
  beforeSrc?: string;
  title: string;
};

export function ImageComparison({ lang, afterSrc, beforeSrc, title }: ComparisonProps) {
  const [position, setPosition] = useState(50);
  const id = useId();
  const demo = !beforeSrc;
  const zh = lang === "zh";
  const imageSrc = demo ? "/images/demos/cobalt-glass.webp" : afterSrc;
  const imageAlt = demo ? (zh ? "蓝色玻璃瓶与金属的 AI 生成材质演示图" : "AI-generated material study of a cobalt glass bottle and metal") : title;
  return <figure className="comparison" style={{ "--split": `${position}%` } as CSSProperties}>
    <div className="comparison-stage">
      <Image className="comparison-image" src={imageSrc} alt={imageAlt} width={1440} height={1080} draggable={false}/>
      <div className={`comparison-before ${demo ? "comparison-simulation" : ""}`} aria-hidden="true">
        <Image className="comparison-image" src={beforeSrc || imageSrc} alt="" width={1440} height={1080} draggable={false}/>
      </div>
      <span className="comparison-tag comparison-tag-before" aria-hidden="true">{demo ? (zh ? "模拟调整前" : "Simulated before") : (zh ? "原图" : "Before")}</span>
      <span className="comparison-tag comparison-tag-after" aria-hidden="true">{zh ? "调整后" : "After"}</span>
      <div className="comparison-divider" aria-hidden="true"><span>‹ ›</span></div>
      <input
        id={`${id}-range`}
        type="range" min="0" max="100" step="1" value={position}
        aria-label={zh ? "拖动对比图像调整前后" : "Compare before and after"}
        aria-valuetext={zh ? `调整前显示 ${position}%` : `${position}% before visible`}
        aria-describedby={`${id}-caption`}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
    <figcaption id={`${id}-caption`}>
      <div><strong>{zh ? "细节，经得起对比。" : "The difference is in the details."}</strong><p>{demo ? (zh ? "交互演示 · AI 生成素材，同图模拟色彩与对比度变化，非真实修图案例。" : "Interactive demo · AI-generated image with simulated color and contrast changes, not an actual retouching case.") : (zh ? "拖动分割线查看原图与成片，也可使用键盘方向键。" : "Drag the divider or use the arrow keys to compare the original and finished image.")}</p></div>
      <button type="button" onClick={() => setPosition(50)}>{zh ? "重置对比" : "Reset view"}<span aria-hidden="true"> ↺</span></button>
    </figcaption>
  </figure>;
}
