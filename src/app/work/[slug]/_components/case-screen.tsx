import Link from "next/link";
import { Button } from "@/common/components/ui/button";
import type { PortfolioCase } from "@/common/data/cases";
import type { CaseIntro } from "../_content/introductions";
import { EquipmentStudy } from "./equipment-study";
import { ManufacturingStudy } from "./manufacturing-study";
import { PaymentStudy } from "./payment-study";

type Props = { item: PortfolioCase; intro: CaseIntro };

const folio = "font-mono text-[.75rem] leading-[1.6] font-[550] tracking-[.04em]";
const factLabel = "text-[.85rem] text-muted-foreground";
const factValue = "mt-[.35rem] font-[620]";

export function CaseScreen({ item, intro }: Props) {
  return (
    <div className="mx-auto w-[min(1120px,88%)] font-sans break-keep wrap-anywhere text-foreground case-narrow:w-[calc(100%_-_40px)]">
      <header className="flex items-center justify-between gap-4 border-b border-border py-[clamp(12px,2vw,28px)]">
        <Link href="/" className="inline-flex min-h-11 items-center text-xl leading-[inherit] font-[720] tracking-[-.045em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" aria-label="오하민 포트폴리오 홈">오하민</Link>
        <span className={`${folio} text-muted-foreground case-narrow:text-[.65rem]`} lang="en">PORTFOLIO / SELECTED WORK</span>
      </header>
      <main>
        <article aria-labelledby="case-title" className="pt-[clamp(44px,7vw,96px)] pb-[clamp(32px,4vw,56px)]">
          <p className={`${folio} flex items-center gap-3 text-ring before:h-0.5 before:w-[18px] before:bg-current`}><span lang="en">CASE STUDY</span> / {item.field}</p>
          <h1 id="case-title" className="my-[.45em] max-w-[18em] text-[clamp(2.1rem,4.7vw,4.1rem)] leading-[1.24] font-[740] tracking-[-.055em]">{item.title}</h1>
          <p className="max-w-[46rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.75] text-muted-foreground">{intro.summary}</p>
          <dl className="mt-[clamp(32px,4vw,56px)] flex flex-wrap gap-x-[clamp(32px,6vw,80px)] gap-y-[18px] case-narrow:flex-col">
            <div><dt className={factLabel}>내 역할</dt><dd className={factValue}>프론트엔드 개발</dd></div>
            <div><dt className={factLabel}>작업 범위</dt><dd className={factValue}>{intro.scope}</dd></div>
          </dl>
          {item.slug === "manufacturing-performance" && <ManufacturingStudy timing={item.tabTiming} />}
          {item.slug === "payment-recovery" && <PaymentStudy />}
          {item.slug === "equipment-selection" && <EquipmentStudy />}
        </article>
        <nav className="border-t border-border pt-6 pb-12" aria-label="사례 탐색">
          <Button asChild variant="outline" className="focus-visible:outline-offset-4">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 목록으로 돌아갈 때 브라우저가 #work에 키보드 포커스도 복원하도록 한다. */}
            <a href="/#work"><span aria-hidden="true">←</span> 대표 작업 목록으로</a>
          </Button>
        </nav>
      </main>
    </div>
  );
}
