"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/projects";
import { ui } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

export function Navigation({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const t = ui[lang];
  const other = lang === "zh" ? "en" : "zh";
  const otherPath = pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${other}`);
  const items = [
    [t.home, `/${lang}`],
    [t.portfolio, `/${lang}/portfolio`],
    [t.about, `/${lang}/about`],
  ];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const focusTimer = open
      ? window.setTimeout(() => {
          mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
        }, 100)
      : undefined;

    if (open) {
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
    } else {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(".nav a, .nav button, .mobile-menu a")
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      if (focusTimer !== undefined) window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const active = (href: string) => href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return <>
    <header className="nav">
      <div className="shell navin">
        <Link className="brand" href={`/${lang}`} onClick={() => setOpen(false)}>Wilson’s Studio</Link>
        <nav className="navlinks" aria-label="Main navigation">
          {items.map(([label, href]) => <Link className={active(href) ? "active" : ""} href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
        </nav>
        <div className="actions">
          <ThemeToggle lang={lang} />
          <Link className="lang" href={otherPath} onClick={() => setOpen(false)}>{other.toUpperCase()}</Link>
          <button
            ref={menuButtonRef}
            className={`menu-button ${open ? "open" : ""}`}
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? (lang === "zh" ? "关闭菜单" : "Close menu") : (lang === "zh" ? "打开菜单" : "Open menu")}
          >
            <span/><span/>
          </button>
        </div>
      </div>
    </header>
    <div
      ref={mobileMenuRef}
      id="mobile-navigation"
      className={`mobile-menu ${open ? "open" : ""}`}
      role="dialog"
      aria-modal={open}
      aria-label={lang === "zh" ? "移动导航" : "Mobile navigation"}
      aria-hidden={!open}
    >
      <nav>{items.map(([label, href], i) => <Link className={active(href) ? "active" : ""} href={href} key={href} onClick={() => setOpen(false)}>{label}<span>0{i + 1}</span></Link>)}</nav>
    </div>
  </>;
}
