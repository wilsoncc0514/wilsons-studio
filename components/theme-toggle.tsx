"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/projects";

export function ThemeToggle({ lang }: { lang: Locale }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.theme === "dark";
    document.documentElement.classList.toggle("dark", savedDark);
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
        document.documentElement.classList.toggle("dark", nextDark);
        localStorage.theme = nextDark ? "dark" : "light";
      }}
    >
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
    </button>
  );
}
