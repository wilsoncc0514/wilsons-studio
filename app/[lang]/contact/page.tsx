import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${isLocale(lang) ? lang : "zh"}/about#contact`);
}
