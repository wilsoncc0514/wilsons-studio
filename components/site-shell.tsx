import type { Locale } from "@/data/projects"; import { MotionEnhancer } from "./motion-enhancer"; import { Navigation } from "./navigation";
export function Footer({lang}:{lang:Locale}){return <footer className="footer shell"><div className="footerline"><span>© 2026 Wilson’s Studio</span><span>{lang==="zh"?"以想象力创造，因细节而完整。":"Made with imagination. Finished with detail."}</span></div></footer>}
export function Shell({lang,children}:{lang:Locale;children:React.ReactNode}){return <><Navigation lang={lang}/><MotionEnhancer/><main>{children}</main><Footer lang={lang}/></>}
