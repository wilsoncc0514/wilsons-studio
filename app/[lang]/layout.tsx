import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/site-shell";
import { isLocale } from "@/lib/i18n";
import { siteMetadata, siteViewport } from "@/lib/site-metadata";
import "../globals.css";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang === "zh" ? "zh-CN" : "en"}>
      <body>
        <Shell lang={lang}>{children}</Shell>
      </body>
    </html>
  );
}
