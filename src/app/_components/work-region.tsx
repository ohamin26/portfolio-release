"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function WorkRegion({ children }: { children: ReactNode }) {
  const region = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = region.current;
    if (!target || window.location.hash !== `#${target.id}` || document.activeElement !== document.body) return;
    // Link가 처리한 해시 스크롤은 유지하고, 다른 곳에 포커스가 없다면 목록에서 탐색을 이어간다.
    target.focus({ preventScroll: true });
  }, []);

  return (
    <section ref={region} className="scroll-mt-6" id="work" tabIndex={-1} aria-labelledby="work-title">
      {children}
    </section>
  );
}
