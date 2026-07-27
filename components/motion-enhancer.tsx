"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MotionEnhancer() {
  const pathname = usePathname();

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const desktop = window.matchMedia("(min-width: 801px) and (pointer: fine)").matches;
    const lenis = desktop ? new Lenis({
      anchors: { offset: -90 },
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      wheelMultiplier: 0.9,
    }) : null;

    lenis?.on("scroll", ScrollTrigger.update);

    const intro = document.querySelectorAll(".hero .eyebrow, .hero h1, .hero p, .hero .cta, .pagehead > .eyebrow, .pagehead > h1, .pagehead > p");
    gsap.fromTo(
      intro,
      { opacity: 0.35, y: desktop ? 28 : 16, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: desktop ? 0.78 : 0.56,
        stagger: desktop ? 0.075 : 0.045,
        ease: "power3.out",
        clearProps: "transform,opacity,filter",
      }
    );

    const revealGroups = document.querySelectorAll(
      ".sectionhead, .aboutband, .story, .about-intro > *, .about-columns > *, .about-contact > *"
    );
    revealGroups.forEach((node) => {
      gsap.fromTo(node,
        { autoAlpha: 0.72, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        }
      );
    });

    document.querySelectorAll(".grid, .capgrid, .skill-list, .process-grid, .gallery").forEach((group) => {
      const children = Array.from(group.children);
      if (!children.length) return;
      gsap.fromTo(children,
        { autoAlpha: 0.74, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        }
      );
    });

    if (desktop) {
      document.querySelectorAll<HTMLElement>(".project").forEach((card) => {
        const image = card.querySelector("img");
        if (!image) return;
        gsap.fromTo(image,
          { yPercent: -3, scale: 1.06 },
          {
            yPercent: 3,
            scale: 1.01,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.7 },
          }
        );
      });

      const detailImage = document.querySelector(".detailhero > img");
      if (detailImage) {
        gsap.fromTo(detailImage,
          { yPercent: -2, scale: 1.04 },
          {
            yPercent: 2,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: detailImage, start: "top top+=80", end: "bottom top", scrub: 0.8 },
          }
        );
      }
    }

    gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.15 },
    });

    const cards = document.querySelectorAll<HTMLElement>(".project, .cap, .process-grid article");
    const move = (event: Event) => {
      const e = event as PointerEvent;
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    if (desktop) cards.forEach(card => card.addEventListener("pointermove", move));
    ScrollTrigger.refresh();

    return () => {
      lenis?.destroy();
      cards.forEach(card => card.removeEventListener("pointermove", move));
    };
  }, { dependencies: [pathname], revertOnUpdate: true });

  return <div className="scroll-progress" aria-hidden="true"/>;
}
