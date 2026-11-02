"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/projects";

const email = "wilsoncc0514@gmail.com";

export function CopyEmail({ lang }: { lang: Locale }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copied = status === "copied";

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    let success = false;
    try {
      await navigator.clipboard.writeText(email);
      success = true;
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        success = document.execCommand("copy");
      } catch {
        success = false;
      } finally {
        input.remove();
      }
    }
    setStatus(success ? "copied" : "failed");
  }

  return <div className="email-row">
    <span className="email-icon" aria-hidden="true">✉️</span>
    <span className="contact-email">{email}</span>
    <button
      className={`copy-button ${copied ? "copied" : ""}`}
      onClick={copy}
      aria-label={copied ? (lang === "zh" ? "邮箱已复制" : "Email copied") : (lang === "zh" ? "复制邮箱" : "Copy email")}
      title={copied ? (lang === "zh" ? "已复制" : "Copied") : (lang === "zh" ? "复制邮箱" : "Copy email")}
    >
      <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
    </button>
    <span className={status === "failed" ? "copy-feedback" : "sr-only"} role="status" aria-live="polite">
      {copied ? (lang === "zh" ? "邮箱已复制" : "Email copied") : status === "failed" ? (lang === "zh" ? "复制失败，请手动选择邮箱复制。" : "Copy failed. Please select and copy the email address.") : ""}
    </span>
  </div>;
}
