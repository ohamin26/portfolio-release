"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./system-study.module.css";

// 현재 문서에서 홈을 처음 열 때만 재생하며, 상세에서 목록으로 돌아올 때는 건너뛴다.
let visitedHome = false;

export function SystemStudyMotion({ children }: { children: ReactNode }) {
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = figure.current;
    if (!target || visitedHome) return;
    const finish = () => target.removeAttribute("data-assembling");
    const frame = requestAnimationFrame(() => {
      visitedHome = true;
      const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const returning = entry && (entry.type === "back_forward" || new URL(entry.name).pathname !== "/");
      if (returning || location.hash || history.state?.portfolioWorkCard || !target.getClientRects().length ||
          matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      target.setAttribute("data-assembling", "");
    });
    target.addEventListener("animationend", finish);
    target.addEventListener("animationcancel", finish);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("animationend", finish);
      target.removeEventListener("animationcancel", finish);
      finish();
    };
  }, []);

  return (
    <figure ref={figure} className={`${styles.figure} rounded-[5px] bg-muted p-[clamp(18px,2vw,26px)] home-stack:hidden`} aria-hidden="true">
      {children}
    </figure>
  );
}
