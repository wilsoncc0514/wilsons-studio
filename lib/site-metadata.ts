import type { Metadata, Viewport } from "next";
import { themeColors } from "./theme";

export const siteMetadata: Metadata = {
  title: {
    default: "Wilson’s Studio | Visual Design & Photo Retouching Portfolio",
    template: "%s | Wilson’s Studio",
  },
  description:
    "Wilson’s Studio is a personal portfolio showcasing commercial visual design, photo retouching, image compositing, and creative tools.",
  metadataBase: new URL("https://wilsons-studio.vercel.app"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Wilson’s Studio",
    title: "Wilson’s Studio | Visual Design & Photo Retouching Portfolio",
    description:
      "Commercial visual design, photo retouching, image compositing, and creative tools by Wilson.",
  },
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
};
