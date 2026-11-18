export type Locale = "zh" | "en";
export type LocalText = { zh: string; en: string };
export type Project = {
  slug: string;
  title: LocalText;
  category: string;
  tools: string[];
  coverImage: string;
  galleryImages: string[];
  placeholder?: boolean;
  comparison?: { beforeSrc: string };
  demo?: "moodboard" | "palette";
  year: string;
  content?: { background: LocalText; goal: LocalText; process: LocalText };
};

const categories = ["commercial-cover","photo-retouching","creative-tools"];
const names = [
  ["新消费品牌封面","New Brand Campaign"],["城市文化展主视觉","Urban Culture Key Visual"],
  ["自然光人像精修","Natural Light Portrait"],["产品质感重塑","Product Finish Study"],["灵感情绪板工具","Moodboard Generator"],["智能配色实验室","Smart Color Lab"]
];
export const categoryNames:Record<string,LocalText> = {
  "commercial-cover":{zh:"商业封面",en:"Commercial Cover"},
  "photo-retouching":{zh:"修图案例",en:"Photo Retouching"}, "creative-tools":{zh:"创意工具",en:"Creative Tools"}
};

export const resolveProjectCategory = (category: string | null | undefined) =>
  category && Object.hasOwn(categoryNames, category) ? category : "all";
export const projects:Project[] = names.map((n,i)=>({
  slug:["new-brand-campaign","urban-culture-visual","natural-light-portrait","product-finish-study","moodboard-generator","smart-color-lab"][i],
  title:{zh:n[0],en:n[1]}, category:categories[Math.floor(i/2)],
  demo:i===4?"moodboard":i===5?"palette":undefined,
  placeholder:i<4,
  tools:i<2?["Photoshop","Illustrator"]:i<4?["Photoshop","Capture One"]:["Figma","Creative Workflow"],
  coverImage:`/images/projects/placeholder-${i+3}.jpg`, galleryImages:[], year:i<2?"2026":"2025",
  content:i>=4?{
    background:{zh:"这是一项个人创意工具概念，用交互原型探索从参考素材到视觉方向的过程。",en:"A personal creative tool concept, using an interactive prototype to explore the journey from reference material to visual direction."},
    goal:{zh:"让素材、色板与构图之间的关系更直观，帮助观看者理解设计选择。",en:"Make the relationship between reference, palette, and composition easier to understand."},
    process:{zh:"通过步骤切换与预设方向展示视觉变化。当前使用示例素材与固定色板，不提供上传、自动取色或 AI 生成功能。",en:"Step controls and preset directions demonstrate the visual changes. This prototype uses sample imagery and fixed palettes; upload, automatic color extraction, and AI generation are not provided."}
  }:undefined
}));
export const getProject=(slug:string)=>projects.find(p=>p.slug===slug);
