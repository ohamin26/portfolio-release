import Link from "next/link";
import { cases } from "@/common/data/cases";
import { DeviceStudy, TimingStudy } from "./work-figures";
import { bodyCopy, eyebrow, folioLabel, microLabel, sectionTitle } from "./home-typography";

export function WorkSection() {
  return (
    <section className="scroll-mt-6" id="work" tabIndex={-1} aria-labelledby="work-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="work-title" className={eyebrow}>
          <span className="sr-only">대표 작업</span><span aria-hidden="true">01  /  SELECTED WORK</span>
        </h2>
        <span className={`${folioLabel} text-muted-foreground home-narrow:text-[.58rem]`} aria-hidden="true">OH HAMIN  •  PORTFOLIO</span>
      </div>
      {cases.map((item, index) => {
        const number = String(index + 1).padStart(2, "0");
        const titleLink = <Link className="inline-flex min-h-11 items-center text-inherit underline decoration-[#aebcd4] decoration-1 underline-offset-[.15em] hover:text-ring hover:decoration-current focus-visible:text-ring focus-visible:decoration-current" href={`/work/${item.slug}`}>{item.title}</Link>;
        if (item.slug === "manufacturing-performance") {
          return (
            <article className="my-8 grid grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] items-center gap-[clamp(28px,4vw,64px)] home-stack:my-[22px] home-stack:grid-cols-1 home-stack:gap-[22px]" key={item.slug}>
              <div>
                <p className={eyebrow}>{number}  /  {item.field}</p>
                <h3 className="mt-4 mb-5 text-[clamp(1.9rem,2.85vw,2.55rem)] font-[720] leading-[1.37] tracking-[-.055em]">{titleLink}</h3>
                <p className={bodyCopy}>다른 탭을 잠깐 확인하고 돌아와도 입력한 내용은 남아 있어야 합니다.
                  그 흐름은 유지하면서 보이지 않는 화면까지 다시 그리는 일은 줄였습니다.</p>
                <p className={`mt-4 ${bodyCopy}`}>웹·키오스크·태블릿의 화면 구조도 다시 설계했습니다.
                  자재 수량을 확인하는 규칙은 함께 쓰고, 입력 방식은 마우스와 터치에 맞게 나눴습니다.</p>
              </div>
              <div className="grid gap-3.5">
                <DeviceStudy />
                {item.tabTiming && <TimingStudy timing={item.tabTiming} />}
              </div>
            </article>
          );
        }
        return (
          <article className="grid grid-cols-[minmax(0,22%)_minmax(0,1fr)] items-center gap-[18px] border-t border-border py-7 last:border-b home-narrow:grid-cols-1 home-narrow:gap-1.5 home-narrow:py-5" key={item.slug}>
            <div className="flex items-center gap-3 font-[650]"><span className={microLabel}>{number}</span>{item.field}</div>
            <h3 className={`${sectionTitle} home-narrow:text-[1.04rem]`}>{titleLink}</h3>
          </article>
        );
      })}
    </section>
  );
}
