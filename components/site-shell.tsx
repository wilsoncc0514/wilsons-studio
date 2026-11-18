import type { Locale } from "@/data/projects";
import { Navigation } from "./navigation";
import { ProjectTransitions } from "./project-transition";
import { MotionArt } from "./motion-art";

function Footer() {
  return (
    <footer className="footer shell">
      <div className="footerline">
        <span translate="no">© 2026 Wilson’s Studio</span>
      </div>
    </footer>
  );
}

export function Shell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    <ProjectTransitions><MotionArt/><div className="site-content">
      <a className="skip-link" href="#main-content">
        {lang === "zh" ? "跳到主要内容" : "Skip to main content"}
      </a>
      <Navigation lang={lang} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </div></ProjectTransitions>
  );
}
