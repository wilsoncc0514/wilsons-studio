import Image from "next/image";
import Link from "next/link";
import { categoryNames, type Locale, type Project } from "@/data/projects";

export function ProjectCard({ project, lang, eager = false, headingLevel = 3 }: { project: Project; lang: Locale; eager?: boolean; headingLevel?: 2 | 3 }) {
  const title = project.title[lang];
  const category = categoryNames[project.category][lang];

  return (
    <Link
      className="project"
      href={`/${lang}/portfolio/${project.slug}`}
      aria-label={`${title} — ${category}`}
    >
      <Image src={project.coverImage} alt={title} width={1200} height={900} loading={eager ? "eager" : "lazy"}/>
      <div className="meta">
        <div>
          {headingLevel === 2 ? <h2>{title}</h2> : <h3>{title}</h3>}
          <p>{category} · {project.year}</p>
        </div>
        <span className="arrow" aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
