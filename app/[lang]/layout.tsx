import { notFound } from "next/navigation"; import { Shell } from "@/components/site-shell"; import { isLocale } from "@/lib/i18n";
export default async function LangLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();return <Shell lang={lang}>{children}</Shell>}
