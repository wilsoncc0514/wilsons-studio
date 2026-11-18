import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryNames, getProject, projects } from "@/data/projects";
import { isLocale, ui } from "@/lib/i18n";
import { ImageComparison } from "@/components/image-comparison";
import { CreativeToolDemo } from "@/components/creative-tool-demo";

export function generateStaticParams() {
  return ["zh", "en"].flatMap(lang => projects.map(project => ({ lang, slug: project.slug })));
}

export default async function Detail({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const t = ui[lang];
  const stories = project.content ? [
    [t.background, project.content.background[lang]],
    [t.goal, project.content.goal[lang]],
    [t.process, project.content.process[lang]],
  ] : [];
  const gallery = project.galleryImages.filter((image) => image !== project.coverImage);

  return (
    <div className="shell detailhero">
      {!project.demo && <Image data-project-cover src={project.coverImage} alt={project.title[lang]} width={1600} height={900} sizes="(max-width: 1240px) 100vw, 1176px" loading="eager" fetchPriority="high"/>}
      <div className="detailtop">
        <h1>{project.title[lang]}</h1>
        <div className="facts">
          <div className="fact"><small>{t.category}</small><span>{categoryNames[project.category][lang]}</span></div>
          <div className="fact"><small>{t.year}</small><span>{project.year}</span></div>
          <div className="fact fact-tools"><small>{t.tools}</small><span>{project.tools.join(" · ")}</span></div>
        </div>
      </div>
      {project.placeholder && <p className="project-placeholder-note">{lang === "zh" ? "当前封面为占位图，尚非作品成片。" : "The cover is a placeholder, not finished work."}</p>}
      {project.comparison && <section className="detail-comparison" aria-label={lang === "zh" ? "修图对比" : "Retouching comparison"}><ImageComparison lang={lang} afterSrc={project.coverImage} beforeSrc={project.comparison.beforeSrc} title={project.title[lang]}/></section>}
      {project.category === "photo-retouching" && !project.comparison && <Link className="text-link" href={`/${lang}#retouch-demo`}>{lang === "zh" ? "试用独立修图对比演示" : "Try the separate retouching demo"}</Link>}
      {project.demo && <section className="detail-tool-demo" aria-label={lang === "zh" ? "创意工具交互原型" : "Creative tool prototype"}><CreativeToolDemo lang={lang} kind={project.demo}/></section>}
      {stories.map(([title, copy]) => (
        <section className="story" key={title}>
          <h2>{title}</h2>
          <p>{copy}</p>
        </section>
      ))}
      {gallery.length > 0 && <div className="gallery">
        {gallery.map((image, index) => (
          <Image key={image} src={image} alt={`${project.title[lang]} ${index + 1}`} width={1400} height={1000} sizes={gallery.length === 1 ? "(max-width: 1240px) 100vw, 1176px" : "(max-width: 800px) 100vw, (max-width: 1240px) 50vw, 578px"}/>
        ))}
      </div>}
      <Link className="button ghost back" href={`/${lang}/portfolio`}>← {t.back}</Link>
    </div>
  );
}
