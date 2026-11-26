"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/common/components/ui/button";
import { DisclosureChevron } from "@/common/components/ui/icons/disclosure-chevron";
import { NavigationArrow } from "@/common/components/ui/icons/navigation-arrow";
import { cases, type PortfolioCase } from "@/common/data/cases";
import { readReturningCard, rememberWorkCard } from "@/common/lib/work-card-return";
import { bodyCopy, microLabel, sectionTitle } from "./home-typography";

type Slug = PortfolioCase["slug"];
const buttonId = (slug: Slug) => `work-button-${slug}`;

export function WorkCards({ children: manufacturingFigures }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<Slug | null>(cases[0].slug);
  const lastPressed = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    let frame = 0;
    function restore() {
      const slug = readReturningCard();
      if (slug) {
        setExpanded(slug);
        // 열린 패널의 높이가 반영된 뒤, 브라우저의 이전 스크롤 좌표 대신 제목에 맞춘다.
        frame = requestAnimationFrame(() => {
          const button = document.getElementById(buttonId(slug));
          button?.focus({ preventScroll: true });
          button?.scrollIntoView({ block: "start", behavior: "instant" });
        });
      } else if (window.location.hash === "#work" && document.activeElement === document.body) {
        document.getElementById("work")?.focus({ preventScroll: true });
      }
    }
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) restore();
    }
    restore();
    window.addEventListener("pageshow", onPageShow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  useLayoutEffect(() => {
    // 위쪽의 큰 패널이 닫히더라도 방금 누른 제목이 화면 밖으로 사라지지 않게 한다.
    const button = lastPressed.current;
    if (!button) return;
    lastPressed.current = null;
    button.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [expanded]);

  return cases.map((item, index) => {
    const open = expanded === item.slug;
    const panelId = `work-panel-${item.slug}`;
    const labelId = `work-title-${item.slug}`;
    return (
      <article key={item.slug} className="border-t border-border last:border-b">
        <h3>
          <button id={buttonId(item.slug)} type="button" aria-expanded={open} aria-controls={panelId} aria-labelledby={labelId}
            className="grid min-h-11 w-full cursor-pointer scroll-mt-6 grid-cols-[minmax(0,22%)_minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-1.5 py-6 text-left hover:text-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring home-narrow:grid-cols-[minmax(0,1fr)_1.5rem] home-narrow:py-4"
            onClick={(event) => {
              lastPressed.current = event.currentTarget;
              setExpanded(open ? null : item.slug);
            }}>
            <span className="flex items-center gap-3 font-semibold home-narrow:col-span-2">
              <span className={microLabel}>{String(index + 1).padStart(2, "0")}</span>{item.field}
            </span>
            <span id={labelId} className={sectionTitle}>{item.title}</span>
            <DisclosureChevron expanded={open} />
          </button>
        </h3>
        <div id={panelId} hidden={!open}>
          <div className={item.slug === "manufacturing-performance"
            ? "grid grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] items-start gap-[clamp(22px,4vw,64px)] pb-7 home-stack:grid-cols-1"
            : "max-w-prose pb-7"}>
            <div>
              <p className={bodyCopy}>{item.role}</p>
              <Button asChild variant="link" className="mt-2 px-0">
                <Link href={`/work/${item.slug}`} onNavigate={() => rememberWorkCard(item.slug)}>
                  상세 보기 <NavigationArrow direction="right" />
                </Link>
              </Button>
            </div>
            {item.slug === "manufacturing-performance" && manufacturingFigures}
          </div>
        </div>
      </article>
    );
  });
}
