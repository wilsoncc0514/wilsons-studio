import Image from "next/image";
import type { CSSProperties } from "react";
import type { Locale } from "@/data/projects";
import { demoPalettes, type ToolDemoKind } from "@/data/tool-demos";

export function ToolComposition({ lang, kind, palette = 0, compact = false }: { lang: Locale; kind: ToolDemoKind; palette?: number; compact?: boolean }) {
  const colors = demoPalettes[palette].colors;
  return <div className={`demo-composition demo-composition-${kind}${compact ? " demo-cover" : ""}`} aria-hidden="true" style={{ "--demo-ink": colors[4], "--demo-accent": colors[0], "--demo-paper": colors[2], "--demo-soft": colors[1] } as CSSProperties}>
    {kind === "palette" ? <div className="demo-poster"><div className="demo-poster-top"><span>Wilson’s Studio</span><span>Color study</span></div><div className="demo-poster-mark"><span/><i/></div><strong>{lang === "zh" ? <>色彩，<br/>自有秩序。</> : <>Color.<br/>In context.</>}</strong><div className="demo-poster-bottom"><span>{demoPalettes[palette].name[lang]}</span><span>W / Studio study</span></div></div> : <div className="demo-board"><div className="demo-board-photo"><Image src="/images/demos/cobalt-glass.webp" alt="" width={1440} height={1080} sizes="(max-width: 800px) 80vw, 440px"/></div><div className="demo-board-type"><span>Material / Type / Color</span><strong>{lang === "zh" ? <>有质感。<br/>有方向。</> : <>Tactile.<br/>Intentional.</>}</strong></div><div className="demo-board-color"><span>{colors[0]}</span></div></div>}
  </div>;
}
