import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wilson’s Studio | Visual Design & Photo Retouching Portfolio",
  description: "Wilson’s Studio is a personal portfolio showcasing commercial visual design, photo retouching, image compositing, and creative tools.",
  metadataBase: new URL("https://wilsons-studio.vercel.app"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh" suppressHydrationWarning><body>{children}</body></html>;
}
