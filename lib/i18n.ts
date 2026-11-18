import type { Locale } from "@/data/projects";

export const isLocale = (value: string): value is Locale => value === "zh" || value === "en";

export const ui = {
  zh: {
    home: "首页", portfolio: "作品集", about: "关于我",
    work: "精选作品", viewAll: "查看全部作品", skills: "核心能力",
    aboutWilson: "关于 Wilson", contactMe: "与我联系", back: "返回作品集",
    year: "年份", tools: "使用工具", category: "分类",
    background: "项目背景", goal: "设计目标", process: "创作说明", all: "全部",
  },
  en: {
    home: "Home", portfolio: "Portfolio", about: "About",
    work: "Selected work", viewAll: "View all projects", skills: "Core capabilities",
    aboutWilson: "About Wilson", contactMe: "Contact me", back: "Back to portfolio",
    year: "Year", tools: "Tools", category: "Category",
    background: "Background", goal: "Design goal", process: "Creative process", all: "All",
  },
};
