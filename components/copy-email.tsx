"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/projects";

const email = "wilsoncc0514@gmail.com";

export function CopyEmail({ lang }: { lang: Locale }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
  }

  return <div className="email-row">
    <span className="email-icon" aria-hidden="true">✉️</span>
    <span className="contact-email">{email}</span>
    <button className={`copy-button ${copied ? "copied" : ""}`} onClick={copy} aria-live="polite">
      <span>{copied ? "✓" : "⧉"}</span>
      {copied ? (lang === "zh" ? "已复制" : "Copied") : (lang === "zh" ? "复制" : "Copy")}
    </button>
  </div>;
}
