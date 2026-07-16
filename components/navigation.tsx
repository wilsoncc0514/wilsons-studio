"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/data/projects";
import { ui } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

export function Navigation({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = ui[lang];
  const other = lang === "zh" ? "en" : "zh";
  const otherPath = pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${other}`);
  const items = [
    [t.home, `/${lang}`],
    [t.portfolio, `/${lang}/portfolio`],
    [t.about, `/${lang}/about`],
  ];

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const active = (href: string) => href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return <header className="nav">
    <div className="shell navin">
      <Link className="brand" href={`/${lang}`}>Wilson’s Studio</Link>
      <nav className="navlinks" aria-label="Main navigation">
        {items.map(([label, href]) => <Link className={active(href) ? "active" : ""} href={href} key={href}>{label}</Link>)}
      </nav>
      <div className="actions">
        <ThemeToggle />
        <Link className="lang" href={otherPath}>{other.toUpperCase()}</Link>
        <button className={`menu-button ${open ? "open" : ""}`} onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}><span/><span/></button>
      </div>
    </div>
    <div id="mobile-navigation" className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
      <nav>{items.map(([label, href], i) => <Link style={{ "--delay": `${i * 45}ms` } as React.CSSProperties} className={active(href) ? "active" : ""} href={href} key={href}>{label}<span>0{i + 1}</span></Link>)}</nav>
    </div>
  </header>;
}
