"use client";

import { useState } from "react";
import { categoryNames, projects, type Locale } from "@/data/projects";
import { ui } from "@/lib/i18n";
import { ProjectCard } from "./project-card";

export function PortfolioGrid({ lang }: { lang: Locale }) {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? projects : projects.filter(project => project.category === filter);
  return <>
    <div className="filters" role="group" aria-label={lang === "zh" ? "作品分类" : "Project categories"}>
      <button className={`chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>{ui[lang].all}</button>
      {Object.entries(categoryNames).map(([key, value]) => <button className={`chip ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)} key={key}>{value[lang]}</button>)}
    </div>
    <div className="grid project-grid" key={filter}>{visible.map(project => <ProjectCard key={project.slug} project={project} lang={lang}/>)}</div>
    <p className="result-count">{lang === "zh" ? `显示 ${visible.length} 个项目` : `${visible.length} projects shown`}</p>
  </>;
}
