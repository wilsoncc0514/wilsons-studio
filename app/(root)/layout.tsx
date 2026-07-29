import type { Metadata, Viewport } from "next";
import { siteMetadata, siteViewport } from "@/lib/site-metadata";
import "../globals.css";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

export default function RootRedirectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
