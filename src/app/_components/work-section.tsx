import { cases } from "@/common/data/cases";
import { DeviceStudy, TimingStudy } from "./work-figures";
import s from "./home.module.css";

const fields: Record<string, string> = {
  "manufacturing-performance": "제조 현장",
  "payment-recovery": "정비 서비스",
  "equipment-selection": "산업 모니터링",
};

export function WorkSection() {
  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title">
      <div className={s.workHeading}>
        <h2 id="work-title" className={s.eyebrow}>
          <span className="sr-only">대표 작업</span><span aria-hidden="true">01  /  SELECTED WORK</span>
        </h2>
        <span className={s.folio} aria-hidden="true">OH HAMIN  •  PORTFOLIO</span>
      </div>
      {cases.map((item, index) => {
        const number = String(index + 1).padStart(2, "0");
        if (item.slug === "manufacturing-performance") {
          return (
            <article className={s.feature} key={item.slug}>
              <div className={s.featureCopy}>
                <p className={s.eyebrow}>{number}  /  {fields[item.slug]}</p>
                <h3>{item.title}</h3>
                <p>다른 탭을 잠깐 확인하고 돌아와도 입력한 내용은 남아 있어야 합니다.
                  그 흐름은 유지하면서 보이지 않는 화면까지 다시 그리는 일은 줄였습니다.</p>
                <p>웹·키오스크·태블릿의 화면 구조도 다시 설계했습니다.
                  자재 수량을 확인하는 규칙은 함께 쓰고, 입력 방식은 마우스와 터치에 맞게 나눴습니다.</p>
              </div>
              <div className={s.figures}>
                <DeviceStudy />
                {item.tabTiming && <TimingStudy timing={item.tabTiming} />}
              </div>
            </article>
          );
        }
        return (
          <article className={s.caseRow} key={item.slug}>
            <div className={s.caseField}><span className={s.micro}>{number}</span>{fields[item.slug]}</div>
            <h3>{item.title}</h3>
          </article>
        );
      })}
    </section>
  );
}
