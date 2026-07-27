import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <div className="not-found-mark" aria-hidden="true">404</div>
      <div>
        <p className="eyebrow">Page not found</p>
        <h1>这里没有你要找的页面。</h1>
        <p>链接可能已失效，或地址输入有误。你可以返回 Wilson’s Studio 首页继续浏览。</p>
        <div className="cta">
          <Link className="button" href="/zh">返回中文首页</Link>
          <Link className="button ghost" href="/en">English home</Link>
        </div>
      </div>
    </main>
  );
}
