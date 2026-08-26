import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { isLocale, ui } from "@/lib/i18n";

export default async function Portfolio({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <>
      <header className="pagehead shell">
        <div className="eyebrow">Selected archive</div>
        <h1>{t.portfolio}</h1>
        <p>{t.portfolioIntro}</p>
      </header>
      <section className="shell section portfolio-section">
        <Suspense fallback={<PortfolioGrid lang={lang} filter="all"/>}>
          <PortfolioFilter lang={lang}/>
        </Suspense>
      </section>
    </>
  );
}
