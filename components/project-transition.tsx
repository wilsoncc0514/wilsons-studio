"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type ReactNode } from "react";

type Navigate = (anchor: HTMLAnchorElement, href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);

// A persistent layer keeps the image alive while App Router replaces page content.
export function ProjectTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = useRef<{ image: HTMLImageElement; target?: HTMLImageElement; href: string; cleanup: () => void } | null>(null);

  const navigate = useCallback<Navigate>((anchor, href) => {
    active.current?.cleanup();
    const source = anchor.querySelector("img");
    if (anchor.dataset.transition === "none" || !source || !source.complete || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }
    const rect = source.getBoundingClientRect();
    const image = document.createElement("img");
    image.src = source.currentSrc || source.src;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.className = "project-flight";
    const radius = getComputedStyle(source).borderRadius;
    gsap.set(image, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: radius });
    document.body.append(image);
    const timeout = window.setTimeout(() => active.current?.cleanup(), 2500);
    const cleanup = () => {
      clearTimeout(timeout);
      gsap.killTweensOf(image);
      image.remove();
      if (active.current?.image === image && active.current.target) active.current.target.style.opacity = "";
      if (active.current?.image === image) active.current = null;
    };
    active.current = { image, href, cleanup };
    router.push(href, { scroll: false });
  }, [router]);

  useEffect(() => {
    const flight = active.current;
    if (!flight) return;
    if (flight.href !== pathname) { flight.cleanup(); return; }
    let frame = 0;
    let target: HTMLImageElement | null = null;
    const finish = () => {
      if (target) target.style.opacity = "";
      flight.cleanup();
    };
    const settle = () => {
      if (active.current !== flight) return;
      target = document.querySelector<HTMLImageElement>("[data-project-cover]");
      if (!target) { frame = requestAnimationFrame(settle); return; }
      window.scrollTo({ top: 0, behavior: "instant" });
      const rect = target.getBoundingClientRect();
      flight.target = target;
      target.style.opacity = "0";
      gsap.to(flight.image, {
        left: rect.left, top: rect.top, width: rect.width, height: rect.height,
        borderRadius: getComputedStyle(target).borderRadius,
        duration: 0.65, ease: "power3.inOut", onComplete: finish,
      });
    };
    // Let Next's scroll restoration and the destination layout settle first.
    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(settle); });
    window.addEventListener("resize", finish, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", finish);
      finish();
    };
  }, [pathname]);

  useEffect(() => () => active.current?.cleanup(), []);
  return <TransitionContext.Provider value={navigate}>{children}</TransitionContext.Provider>;
}

export function ProjectLink({ href, children, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const navigate = useContext(TransitionContext);
  const anchor = useRef<HTMLAnchorElement>(null);
  return <Link {...props} href={href} ref={anchor} onNavigate={(event) => {
    if (!navigate || !anchor.current) return;
    event.preventDefault();
    navigate(anchor.current, href);
  }}>{children}</Link>;
}
