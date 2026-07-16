"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionEnhancer() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const nodes = document.querySelectorAll(".sectionhead, .project, .cap, .aboutband, .pagehead > *, .story, .gallery img, .about-intro > *, .about-columns > *, .skill-list > div, .process-grid > article, .about-contact > *");
    nodes.forEach((node, index) => {
      node.classList.add("reveal");
      (node as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px" });
    nodes.forEach(node => observer.observe(node));

    const cards = document.querySelectorAll<HTMLElement>(".project, .cap, .process-grid article");
    const move = (event: Event) => {
      const e = event as PointerEvent;
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll-progress", `${max > 0 ? window.scrollY / max : 0}`);
    };
    cards.forEach(card => card.addEventListener("pointermove", move));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); cards.forEach(card => card.removeEventListener("pointermove", move)); window.removeEventListener("scroll", onScroll); };
  }, [pathname]);
  return <div className="scroll-progress" aria-hidden="true"/>;
}
