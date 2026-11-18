"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/projects";
import { themeColors } from "@/lib/theme";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  const color = dark ? themeColors.dark : themeColors.light;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => { meta.content = color; });
}

export function ThemeToggle({ lang }: { lang: Locale }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let savedDark = false;
    try { savedDark = localStorage.getItem("theme") === "dark"; } catch { /* Storage may be unavailable. */ }
    applyTheme(savedDark);
    const frame = window.requestAnimationFrame(() => setDark(savedDark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const label = dark
    ? (lang === "zh" ? "切换到浅色模式" : "Switch to light mode")
    : (lang === "zh" ? "切换到深色模式" : "Switch to dark mode");

  return (
    <button
      className="iconbtn"
      type="button"
      aria-label={label}
      aria-pressed={dark}
      title={label}
      onClick={() => {
        const nextDark = !dark;
        setDark(nextDark);
        applyTheme(nextDark);
        try { localStorage.setItem("theme", nextDark ? "dark" : "light"); } catch { /* Theme still works for this visit. */ }
      }}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {dark ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/></> : <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z"/>}
      </svg>
    </button>
  );
}
