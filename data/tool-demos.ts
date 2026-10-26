export type ToolDemoKind = "palette" | "moodboard";

export const demoPalettes = [
  { name: { zh: "玻璃蓝", en: "Glass blue" }, colors: ["#213FA6", "#8EACDA", "#E7DDCC", "#B3A18B", "#182238"] },
  { name: { zh: "岩石暖", en: "Warm stone" }, colors: ["#8B543B", "#C99876", "#F0E7DA", "#D3C1AB", "#342B25"] },
] as const;

export const toolDemoCopy = {
  palette: {
    zh: { title: "从一张素材，到一套视觉。", steps: ["观察素材", "梳理色板", "应用版式"], stories: ["从玻璃、石材与光影里寻找颜色的线索。", "把预设颜色分为主色、辅助色与背景色。", "将选定色板应用到同一张版式，观察视觉重心的变化。"] },
    en: { title: "From one image to a visual direction.", steps: ["Observe", "Build a palette", "Apply"], stories: ["Look for color cues in glass, stone, and light.", "Give the preset colors a role: primary, supporting, and background.", "Apply a palette to the same layout and see how the emphasis changes."] },
  },
  moodboard: {
    zh: { title: "让零散灵感，有一个方向。", steps: ["收集线索", "编排关系", "形成方向"], stories: ["将一张素材的质感、色彩与文字线索放在一起。", "调整图片、色块与字样的层次，建立视觉关系。", "把线索整理成一张可讨论的情绪板，而非最终设计稿。"] },
    en: { title: "Give your references a direction.", steps: ["Collect", "Compose", "Define"], stories: ["Gather texture, color, and type cues around one reference image.", "Arrange the image, colors, and lettering into a visual hierarchy.", "Bring the references into a moodboard for discussion, not a finished design."] },
  },
} as const;
