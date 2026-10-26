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
  const stories = [
    [t.background, project.content.background[lang]],
    [t.goal, project.content.goal[lang]],
    [t.process, project.content.process[lang]],
  ];

  return (
    <div className="shell detailhero">
      {!project.demo && <Image data-project-cover src={project.coverImage} alt={project.title[lang]} width={1600} height={900} priority/>}
      <div className="detailtop">
        <h1>{project.title[lang]}</h1>
        <div className="facts">
          <div className="fact"><small>{t.category}</small><span>{categoryNames[project.category][lang]}</span></div>
          <div className="fact"><small>{t.year}</small><span>{project.year}</span></div>
          <div className="fact fact-tools"><small>{t.tools}</small><span>{project.tools.join(" · ")}</span></div>
        </div>
      </div>
      {project.category === "photo-retouching" && <section className="detail-comparison" aria-label={lang === "zh" ? "修图对比演示" : "Retouching comparison demo"}><ImageComparison lang={lang} afterSrc={project.coverImage} beforeSrc={project.comparison?.beforeSrc} title={project.title[lang]}/></section>}
      {project.demo && <section className="detail-tool-demo" aria-label={lang === "zh" ? "创意工具交互原型" : "Creative tool prototype"}><CreativeToolDemo lang={lang} kind={project.demo}/></section>}
      {stories.map(([title, copy]) => (
        <section className="story" key={title}>
          <h2>{title}</h2>
          <p>{copy}</p>
        </section>
      ))}
      {!project.demo && <div className="gallery">
        {project.galleryImages.map((image, index) => (
          <Image key={image} src={image} alt={`${project.title[lang]} ${index + 1}`} width={1400} height={1000}/>
        ))}
      </div>}
      <Link className="button ghost back" href={`/${lang}/portfolio`}>← {t.back}</Link>
    </div>
  );
}
