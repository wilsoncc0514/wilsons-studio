"use client";

import { useSearchParams } from "next/navigation";
import { resolveProjectCategory, type Locale } from "@/data/projects";
import { PortfolioGrid } from "./portfolio-grid";

export function PortfolioFilter({ lang }: { lang: Locale }) {
  const searchParams = useSearchParams();
  const filter = resolveProjectCategory(searchParams.get("category"));

  return <PortfolioGrid lang={lang} filter={filter} />;
}
