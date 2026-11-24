import Link from "next/link";
import { buttonVariants } from "@/common/components/ui/button";
import type { PortfolioCase } from "@/common/data/cases";
import type { CaseIntro } from "../_content/introductions";
import { EquipmentStudy } from "./equipment-study";
import { ManufacturingStudy } from "./manufacturing-study";
import { PaymentStudy } from "./payment-study";
import s from "./case.module.css";

type Props = { item: PortfolioCase; intro: CaseIntro };

export function CaseScreen({ item, intro }: Props) {
  return (
    <div className={s.page}>
      <header className={s.masthead}>
        <Link href="/" aria-label="오하민 포트폴리오 홈">오하민</Link>
        <span className={s.folio} lang="en">PORTFOLIO / SELECTED WORK</span>
      </header>
      <main>
        <article aria-labelledby="case-title" className={s.article}>
          <p className={s.eyebrow}><span lang="en">CASE STUDY</span> / {item.field}</p>
          <h1 id="case-title">{item.title}</h1>
          <p className={s.summary}>{intro.summary}</p>
          <dl className={s.facts}>
            <div><dt>내 역할</dt><dd>프론트엔드 개발</dd></div>
            <div><dt>작업 범위</dt><dd>{intro.scope}</dd></div>
          </dl>
          {item.slug === "manufacturing-performance" && <ManufacturingStudy timing={item.tabTiming} />}
          {item.slug === "payment-recovery" && <PaymentStudy />}
          {item.slug === "equipment-selection" && <EquipmentStudy />}
        </article>
        <nav className={s.returnNav} aria-label="사례 탐색">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 목록으로 돌아갈 때 브라우저가 #work에 키보드 포커스도 복원하도록 한다. */}
          <a href="/#work" className={buttonVariants({ variant: "outline" })}>
            <span aria-hidden="true">←</span> 대표 작업 목록으로
          </a>
        </nav>
      </main>
    </div>
  );
}
