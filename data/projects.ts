export type Locale = "zh" | "en";
export type LocalText = { zh: string; en: string };
export type Project = { slug:string; title:LocalText; category:string; description:LocalText; tools:string[]; coverImage:string; galleryImages:string[]; comparison?: { beforeSrc: string }; year:string; content:{ background:LocalText; goal:LocalText; process:LocalText } };

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
  description:{zh:"融合创意概念与精致图像语言，探索具有商业应用价值的视觉表达。",en:"A refined visual exploration that connects creative concepts with practical commercial value."},
  tools:i<2?["Photoshop","Illustrator"]:i<4?["Photoshop","Capture One"]:["Figma","Creative Workflow"],
  coverImage:`/images/projects/placeholder-${i+3}.jpg`, galleryImages:[`/images/projects/placeholder-${i+3}.jpg`,`/images/projects/placeholder-${(i+3)%6+3}.jpg`,`/images/projects/placeholder-${(i+5)%6+3}.jpg`], year:i<2?"2026":"2025",
  content:{
    background:{zh:"这是一个围绕品牌语境与视觉叙事展开的个人概念项目。项目从真实的传播场景出发，尝试建立兼具辨识度与延展性的视觉系统。",en:"This self-initiated concept project explores brand context and visual storytelling, starting from a realistic communication scenario to build a distinctive and flexible visual system."},
    goal:{zh:"在保持信息清晰的前提下，建立高级、统一且有记忆点的画面语言，并让最终成果能够适配不同媒介。",en:"The goal was to keep communication clear while creating a premium, consistent, and memorable visual language that could adapt across formats."},
    process:{zh:"从情绪板、构图草案和色彩测试开始，我通过多轮生成、筛选与精修统一光影和细节，最终完成可用于实际展示的系列画面。",en:"Beginning with moodboards, composition studies, and color tests, I iterated through generation, selection, and detailed retouching to unify light, texture, and the final image series."}
  }
}));
export const getProject=(slug:string)=>projects.find(p=>p.slug===slug);
