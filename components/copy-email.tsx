"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/projects";

const email = "wilsoncc0514@gmail.com";

export function CopyEmail({ lang }: { lang: Locale }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copied = status === "copied";

  useEffect(() => {
    if (status !== "copied") return;
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
      input.readOnly = true;
      input.style.position = "fixed";
      input.style.opacity = "0";
      const focused = document.activeElement;
      document.body.appendChild(input);
      input.select();
      try {
        success = document.execCommand("copy");
      } catch {
        success = false;
      } finally {
        input.remove();
        if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
      }
    }
    setStatus(success ? "copied" : "failed");
  }

  return <div className="email-row">
    <a className="contact-email" href={`mailto:${email}`} translate="no">{email}</a>
    <button
      type="button"
      className={`copy-button ${copied ? "copied" : ""}`}
      onClick={copy}
      aria-label={copied ? (lang === "zh" ? "邮箱已复制" : "Email copied") : (lang === "zh" ? "复制邮箱" : "Copy email")}
      title={copied ? (lang === "zh" ? "已复制" : "Copied") : (lang === "zh" ? "复制邮箱" : "Copy email")}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {copied ? <path d="m5 12 4 4L19 6"/> : <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>}
      </svg>
    </button>
    <span className={status === "failed" ? "copy-feedback" : "sr-only"} role="status" aria-live="polite">
      {copied ? (lang === "zh" ? "邮箱已复制" : "Email copied") : status === "failed" ? (lang === "zh" ? "无法复制。可点击邮箱或手动复制地址。" : "Couldn’t copy. Open the email link or copy the address manually.") : ""}
    </span>
  </div>;
}
