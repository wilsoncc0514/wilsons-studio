import Link from "next/link";
import { categoryNames, projects, type Locale } from "@/data/projects";
import { ui } from "@/lib/i18n";
import { ProjectCard } from "./project-card";

export function PortfolioGrid({ lang, filter }: { lang: Locale; filter: string }) {
  const visible = filter === "all"
    ? projects
    : projects.filter((project) => project.category === filter);
  const portfolioPath = `/${lang}/portfolio`;

  return <>
    <nav className="filters" aria-label={lang === "zh" ? "作品分类" : "Project categories"}>
      <Link
        className={`chip ${filter === "all" ? "active" : ""}`}
        href={portfolioPath}
        aria-current={filter === "all" ? "page" : undefined}
        scroll={false}
      >
        {ui[lang].all}
      </Link>
      {Object.entries(categoryNames).map(([key, value]) => (
        <Link
          className={`chip ${filter === key ? "active" : ""}`}
          href={{ pathname: portfolioPath, query: { category: key } }}
          aria-current={filter === key ? "page" : undefined}
          scroll={false}
          key={key}
        >
          {value[lang]}
        </Link>
      ))}
    </nav>
    <div className="grid project-grid">
      {visible.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          lang={lang}
          eager={index === 0}
          headingLevel={2}
        />
      ))}
    </div>
    <p className="result-count">{lang === "zh" ? `显示 ${visible.length} 个项目` : `${visible.length} projects shown`}</p>
  </>;
}
