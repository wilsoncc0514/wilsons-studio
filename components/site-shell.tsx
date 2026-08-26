import type { Locale } from "@/data/projects";
import { MotionEnhancer } from "./motion-enhancer";
import { Navigation } from "./navigation";

export function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="footer shell">
      <div className="footerline">
        <span translate="no">© 2026 Wilson’s Studio</span>
        <span>{lang === "zh" ? "以想象力创造，因细节而完整。" : "Made with imagination. Finished with detail."}</span>
      </div>
    </footer>
  );
}

export function Shell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    <MotionEnhancer>
      <a className="skip-link" href="#main-content">
        {lang === "zh" ? "跳到主要内容" : "Skip to main content"}
      </a>
      <Navigation lang={lang} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer lang={lang} />
    </MotionEnhancer>
  );
}
