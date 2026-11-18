import { notFound } from "next/navigation";
import { isLocale, ui } from "@/lib/i18n";
import { CopyEmail } from "@/components/copy-email";

const content = {
  zh: {
    intro: "我是 Wilson，一名专注于商业视觉设计与 Photoshop 修图的视觉创作者。我喜欢在想象力与清晰表达之间寻找平衡，让每一个画面既有审美，也能真正服务于传播与商业场景。",
    detail: "我的创作方向包括商业封面、展会视觉、产品图修饰、人物修图与图像合成。我注重构图、色彩统一、人物一致性和整体质感，也持续探索传统设计流程与数字创作工具的结合。",
    philosophy: "工具帮助我拓展视觉可能性，但真正决定作品品质的，始终是判断、选择与对细节的坚持。",
    capabilities: "能力与方向",
    process: "我的创作方式",
    processItems: [["理解","梳理项目背景、受众和应用场景，明确真正需要解决的问题。"],["探索","通过情绪板、构图和生成实验，寻找最有潜力的视觉方向。"],["精修","统一光影、色彩与细节，让概念成为稳定、完整的视觉成果。"]],
    contactTitle: "联系 Wilson",
  },
  en: {
    intro: "I’m Wilson, a visual creator focused on commercial visual design and Photoshop retouching. I look for the balance between imagination and clarity—making work that feels considered and performs in real communication and commercial settings.",
    detail: "My practice spans campaign covers, exhibition visuals, product finishing, portrait retouching, and image compositing. I care deeply about composition, color harmony, consistency, and overall finish, while continuously refining my digital design workflow.",
    philosophy: "Tools can extend visual possibility, but the quality of the result still comes down to judgment, selection, and care for detail.",
    capabilities: "Focus & Capabilities",
    process: "How I Work",
    processItems: [["Understand","Clarify context, audience, and application to identify the real problem."],["Explore","Use moodboards, composition studies, and generation tests to find the strongest direction."],["Refine","Unify light, color, and detail until the concept becomes a reliable visual outcome."]],
    contactTitle: "Contact Wilson",
  }
};

const skills = {
  zh: ["商业视觉设计", "Photoshop 修图", "图像合成", "视觉指导", "创意工作流程"],
  en: ["Commercial visual design", "Photoshop retouching", "Image compositing", "Art direction", "Creative workflows"],
};

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = content[lang];
  return <>
    <header className="pagehead shell">
      <h1>{ui[lang].about}</h1>
    </header>

    <section className="section shell about-intro">
      <p className="lead-copy">{c.intro}</p>
      <div className="about-columns"><p>{c.detail}</p><blockquote>{c.philosophy}</blockquote></div>
    </section>

    <section className="section shell">
      <div className="sectionhead"><h2>{c.capabilities}</h2></div>
      <ul className="skill-list">{skills[lang].map((skill) => <li key={skill}>{skill}</li>)}</ul>
    </section>

    <section className="section shell">
      <div className="sectionhead"><h2>{c.process}</h2></div>
      <div className="process-grid">{c.processItems.map((item, i) => <article key={item[0]}><span>0{i + 1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}</div>
    </section>

    <section className="section shell" id="contact">
      <div className="about-contact"><h2>{c.contactTitle}</h2><CopyEmail lang={lang}/></div>
    </section>
  </>;
}
