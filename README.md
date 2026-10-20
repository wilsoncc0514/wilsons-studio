# Wilson’s Studio

Wilson 的中英双语个人设计作品集，基于 Next.js App Router、TypeScript 与 Tailwind CSS 构建。默认进入 `/zh`，英文版位于 `/en`，支持浅色/暗黑模式。

## 安装与运行

要求 Node.js 20.9 或更高版本。

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。生产构建可运行：

```bash
npm run build
npm start
```

## 替换作品内容与图片

作品数据统一存放在 `data/projects.ts`。每个项目包含 `slug`、双语标题、分类、描述、工具、封面、画廊、年份和项目说明。新增数据后，详情页会根据 `slug` 自动生成。

当前六个作品使用 `public/images/projects/placeholder-3.jpg` 至 `placeholder-8.jpg`。用相同文件名直接替换即可；若使用新文件名，请同步修改 `data/projects.ts` 内的 `coverImage` 和 `galleryImages`。

建议图片使用 JPG 或 WebP，封面保持 4:3 或 16:9，宽度至少 1600px。画廊图片可以使用不同宽高比。

## 动效与修图对比

首页的实时点云由 `components/motion-art.tsx` 绘制，支持鼠标响应、W / 球体变形和暂停。绘制上限为 30fps、1500 个点、1.5 倍像素比；移动端减少点数。离屏、切换后台和“减少动态效果”时停止连续绘制；Canvas 不可用时显示静态矢量封面。

作品卡片通过 `components/project-transition.tsx` 将封面连续展开到详情页。动画仅在普通站内导航时触发，支持键盘，保留新标签页打开行为；减少动态效果时直接导航。转场中断、窗口缩放及超时会清理临时图层。

`components/image-comparison.tsx` 支持鼠标、触控、键盘方向键、Home / End 和重置。当前为明确标注的交互演示，不能作为真实修图成果。替换为真实案例时，在 `data/projects.ts` 的修图项目中配置：

```ts
coverImage: "/images/projects/finished.webp",
comparison: { beforeSrc: "/images/projects/original.webp" },
```

两张图应使用相同构图、尺寸和对齐位置；没有 `beforeSrc` 时组件会自动展示标注为 AI 生成素材的同图滤镜对比。首页优先展示第一个修图项目，修图详情页也包含对比组件。

演示素材：`public/images/demos/cobalt-glass.webp`，由内置 ImageGen 生成并压缩为 WebP。提示词：无品牌钴蓝玻璃香水瓶、拉丝金属瓶盖与曲面金属片，暖色石灰岩，侧光、真实玻璃折射、商业静物摄影，横向 4:3；无文字、标识或水印。

## 修改邮箱

在 `components/copy-email.tsx` 中修改 `email` 常量即可更新邮箱。联系内容已经合并至“关于我”页面，邮箱支持一键复制；旧的 `/contact` 地址会自动跳转到该区域。

## 部署到 Vercel

1. 将项目上传到 GitHub、GitLab 或 Bitbucket。
2. 登录 Vercel，选择 **Add New → Project** 并导入仓库。
3. Vercel 会自动识别 Next.js；无需数据库或环境变量。
4. 点击 **Deploy**。后续推送到主分支会自动重新部署。

也可以安装 Vercel CLI 后在项目目录执行 `vercel`。部署完成后，请把 `app/layout.tsx` 中 `metadataBase` 的示例地址替换为正式域名。

## 主要目录

```text
app/[lang]/                 双语页面与路由
app/[lang]/portfolio/[slug] 动态作品详情页
components/                 导航、页脚、主题切换、作品卡片
data/projects.ts            作品数据
lib/i18n.ts                 界面双语文案
public/images/projects/     作品图片
```
