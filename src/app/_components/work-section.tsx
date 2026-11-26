import { cases } from "@/common/data/cases";
import { WorkCards } from "./work-cards";
import { DeviceStudy, TimingStudy } from "./work-figures";
import { eyebrow, folioLabel } from "./home-typography";

export function WorkSection() {
  const manufacturing = cases.find(({ slug }) => slug === "manufacturing-performance");
  return (
    <section className="scroll-mt-6" id="work" tabIndex={-1} aria-labelledby="work-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="work-title" className={eyebrow}>
          <span className="sr-only">대표 작업</span><span aria-hidden="true">01  /  SELECTED WORK</span>
        </h2>
        <span className={`${folioLabel} text-muted-foreground home-narrow:text-[.58rem]`} aria-hidden="true">OH HAMIN  •  PORTFOLIO</span>
      </div>
      <WorkCards>
        <div className="grid gap-3.5">
          <DeviceStudy />
          {manufacturing?.tabTiming && <TimingStudy timing={manufacturing.tabTiming} />}
        </div>
      </WorkCards>
    </section>
  );
}
