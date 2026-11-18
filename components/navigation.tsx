"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/projects";
import { ui } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

export function Navigation({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const toggle = useRef<HTMLButtonElement>(null);
  const t = ui[lang];
  const other = lang === "zh" ? "en" : "zh";
  const otherPath = pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${other}`);
  const items = [
    [t.home, `/${lang}`],
    [t.portfolio, `/${lang}/portfolio`],
    [t.about, `/${lang}/about`],
  ];

  useEffect(() => {
    const desktop = window.matchMedia("(width > 800px)");
    const close = () => { if (desktop.matches) setOpenPath(null); };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpenPath(null);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [open]);

  const links = items.map(([label, href]) => {
    const current = pathname === href;
    const active = current || pathname.startsWith(`${href}/`) && href !== `/${lang}`;
    return <Link key={href} href={href} className={active ? "active" : undefined}
      aria-current={current ? "page" : undefined} onClick={() => setOpenPath(null)}>{label}</Link>;
  });

  return (
    <header className="nav"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpenPath(null);
      }}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpenPath(null);
          toggle.current?.focus();
        }
      }}>
      <div className="shell navin">
        <Link className="brand" href={`/${lang}`} onClick={() => setOpenPath(null)} translate="no">Wilson’s Studio</Link>
        <nav className="navlinks" aria-label={lang === "zh" ? "主要导航" : "Main navigation"}>{links}</nav>
        <div className="actions">
          <ThemeToggle lang={lang} />
          <Link className="lang" href={otherPath} hrefLang={other === "zh" ? "zh-CN" : "en"} lang={other === "zh" ? "zh-CN" : "en"} aria-label={other === "zh" ? "切换至中文" : "Switch to English"}>{other.toUpperCase()}</Link>
          <button ref={toggle} type="button" className="menu-button" onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? (lang === "zh" ? "关闭菜单" : "Close menu") : (lang === "zh" ? "打开菜单" : "Open menu")}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d={open ? "m6 6 12 12M18 6 6 18" : "M4 8h16M4 16h16"}/>
            </svg>
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-menu shell" hidden={!open} aria-label={lang === "zh" ? "主要导航" : "Main navigation"}>{links}</nav>
    </header>
  );
}
