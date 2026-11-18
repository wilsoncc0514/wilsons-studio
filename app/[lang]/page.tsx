import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreativeToolDemo } from "@/components/creative-tool-demo";
import { ImageComparison } from "@/components/image-comparison";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";
import { isLocale, ui } from "@/lib/i18n";

const caps = {
  zh: [
    ["商业视觉设计", "品牌封面、活动与传播视觉"],
    ["Photoshop 修图", "人像与产品精修"],
    ["图像合成", "素材整合、光影统一与细节处理"],
    ["创意工具", "色板、情绪板与数字创作流程"],
  ],
  en: [
    ["Commercial visual design", "Campaign covers, events, and brand communications"],
    ["Photo retouching", "Portrait and product finishing"],
    ["Image compositing", "Image integration, lighting, and detail"],
    ["Creative tools", "Palettes, moodboards, and digital workflows"],
  ],
};

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const zh = lang === "zh";
  const t = ui[lang];
  const retouch = projects.find((project) => project.category === "photo-retouching" && project.comparison);
  const featured = [
    ...projects.filter((project) => project.demo === "palette"),
    ...projects.filter((project) => !project.demo),
  ];

  return <>
    <section className="hero hero-background shell">
      <div className="hero-copy">
        <h1>{zh ? "商业视觉与图像精修" : "Visual design and photo retouching"}</h1>
        <div className="cta">
          <Link className="button" href={`/${lang}/portfolio?category=all`}>{zh ? "查看作品" : "View work"}</Link>
          <Link className="button ghost" href={`/${lang}/about#contact`}>{t.contactMe}</Link>
        </div>
      </div>
      <a className="hero-study" href="#retouch-demo">
        <Image src="/images/demos/cobalt-glass.webp" alt="" width={1440} height={1080}
          loading="eager" fetchPriority="high" sizes="(max-width: 800px) 100vw, (max-width: 1240px) 37vw, 450px"/>
        <span>{zh ? "修图对比 · AI 演示素材" : "Retouching comparison · AI-generated sample"}<span aria-hidden="true">↘</span></span>
      </a>
    </section>
    <section className="section shell featured-work">
      <div className="sectionhead"><h2>{t.work}</h2><Link className="text-link" href={`/${lang}/portfolio?category=all`}>{t.viewAll}</Link></div>
      <div className="grid featured-grid">{featured.map((project) => <ProjectCard key={project.slug} project={project} lang={lang}/>)}</div>
    </section>
    <section className="section shell retouch-showcase" id="retouch-demo">
      <div className="sectionhead"><h2>{zh ? "修图对比" : "Retouching comparison"}</h2></div>
      <ImageComparison lang={lang} afterSrc={retouch?.coverImage} beforeSrc={retouch?.comparison?.beforeSrc} title={retouch?.title[lang]}/>
      {retouch && <Link className="comparison-project-link" href={`/${lang}/portfolio/${retouch.slug}`}>{zh ? "查看对应项目" : "View the project"}</Link>}
    </section>
    <section className="section shell creative-showcase" id="creative-tools">
      <div className="sectionhead"><h2>{zh ? "创意工具" : "Creative tools"}</h2></div>
      <CreativeToolDemo lang={lang} kind="palette"/>
      <Link className="comparison-project-link" href={`/${lang}/portfolio?category=creative-tools`}>{zh ? "查看创意工具作品" : "View creative tool projects"}</Link>
    </section>
    <section className="section shell">
      <div className="sectionhead"><h2>{t.skills}</h2></div>
      <div className="capgrid">{caps[lang].map(([title, description]) => <article className="cap" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>
    <section className="section shell">
      <div className="aboutband"><h2>{t.aboutWilson}</h2><div>
        <p>{zh ? "Wilson 从事商业视觉设计、Photoshop 精修与图像合成。" : "Wilson works across commercial visual design, Photoshop retouching, and image compositing."}</p>
        <div className="cta"><Link className="text-link" href={`/${lang}/about`}>{t.about}</Link><Link className="button" href={`/${lang}/about#contact`}>{t.contactMe}</Link></div>
      </div></div>
    </section>
  </>;
}
