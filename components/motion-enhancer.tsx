"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type MotionEnhancerProps = {
  children: ReactNode;
};

type MotionConditions = {
  desktop: boolean;
  reduce: boolean;
};

export function MotionEnhancer({ children }: MotionEnhancerProps) {
  const pathname = usePathname();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    const selectAll = <T extends Element>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));
    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 801px) and (pointer: fine)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduce } = context.conditions as MotionConditions;
        if (reduce) return;

        const lenis = desktop
          ? new Lenis({
              anchors: { offset: -90 },
              autoRaf: true,
              lerp: 0.09,
              smoothWheel: true,
              stopInertiaOnNavigate: true,
              wheelMultiplier: 0.9,
            })
          : null;

        lenis?.on("scroll", ScrollTrigger.update);

        const intro = selectAll(
          ".hero .eyebrow, .hero h1, .hero p, .hero .cta, .pagehead > .eyebrow, .pagehead > h1, .pagehead > p",
        );
        gsap.fromTo(
          intro,
          {
            opacity: 0.35,
            y: desktop ? 28 : 14,
          },
          {
            opacity: 1,
            y: 0,
            duration: desktop ? 0.78 : 0.52,
            stagger: desktop ? 0.075 : 0.04,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
        );

        const revealGroups = selectAll(
          ".sectionhead, .aboutband, .story, .about-intro > *, .about-columns > *, .about-contact > *",
        );
        revealGroups.forEach((node) => {
          gsap.fromTo(
            node,
            { autoAlpha: 0.72, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: { trigger: node, start: "top 88%", once: true },
            },
          );
        });

        selectAll(".grid, .capgrid, .skill-list, .process-grid, .gallery").forEach(
          (group) => {
            const items = Array.from(group.children);
            if (!items.length) return;

            gsap.fromTo(
              items,
              { autoAlpha: 0.74, y: 22 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.68,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: { trigger: group, start: "top 88%", once: true },
              },
            );
          },
        );

        if (desktop) {
          selectAll<HTMLElement>(".project").forEach((card) => {
            const image = card.querySelector("img");
            if (!image) return;

            gsap.fromTo(
              image,
              { yPercent: -3, scale: 1.06 },
              {
                yPercent: 3,
                scale: 1.01,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
          });

          const detailImage = root.querySelector(".detailhero > img");
          if (detailImage) {
            gsap.fromTo(
              detailImage,
              { yPercent: -2, scale: 1.04 },
              {
                yPercent: 2,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: detailImage,
                  start: "top top+=80",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          }
        }

        gsap.to(root.querySelector(".scroll-progress"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.15 },
        });

        const pointerCleanups: Array<() => void> = [];
        if (desktop) {
          const bounds = new Map<HTMLElement, DOMRect>();
          const clearBounds = () => bounds.clear();

          selectAll<HTMLElement>(".project, .cap, .process-grid article").forEach(
            (card) => {
              const setX = gsap.quickSetter(card, "--mx", "px");
              const setY = gsap.quickSetter(card, "--my", "px");
              const enter = () => bounds.set(card, card.getBoundingClientRect());
              const leave = () => bounds.delete(card);
              const move = (event: PointerEvent) => {
                let rect = bounds.get(card);
                if (!rect) {
                  rect = card.getBoundingClientRect();
                  bounds.set(card, rect);
                }
                setX(event.clientX - rect.left);
                setY(event.clientY - rect.top);
              };

              card.addEventListener("pointerenter", enter);
              card.addEventListener("pointerleave", leave);
              card.addEventListener("pointermove", move);
              pointerCleanups.push(() => {
                card.removeEventListener("pointerenter", enter);
                card.removeEventListener("pointerleave", leave);
                card.removeEventListener("pointermove", move);
              });
            },
          );

          window.addEventListener("scroll", clearBounds, { passive: true });
          window.addEventListener("resize", clearBounds, { passive: true });
          pointerCleanups.push(() => {
            window.removeEventListener("scroll", clearBounds);
            window.removeEventListener("resize", clearBounds);
          });
        }

        ScrollTrigger.refresh();

        return () => {
          lenis?.off("scroll", ScrollTrigger.update);
          lenis?.destroy();
          pointerCleanups.forEach((cleanup) => cleanup());
        };
      },
    );

    return () => media.revert();
  }, { scope, dependencies: [pathname], revertOnUpdate: true });

  return (
    <div ref={scope}>
      {children}
      <div className="scroll-progress" aria-hidden="true" />
    </div>
  );
}
