import { compareTabTiming, type TabTiming } from "@/common/data/tab-timing";
import s from "./home.module.css";

export function DeviceStudy() {
  return (
    <figure className={s.deviceStudy}>
      <div className={s.micro} lang="en">FIG. 02  /  SHARED VALIDATION</div>
      <div className={s.devices}>
        <div className={s.device}>
          <span className={s.micro} lang="en">01 / DESKTOP</span><strong>자재 불출</strong>
          <table aria-label="자재 불출">
            <thead><tr><th scope="col">품목</th><th scope="col">수량</th></tr></thead>
            <tbody><tr><td>자재 A</td><td>12개</td></tr></tbody>
          </table>
        </div>
        <div className={s.device}>
          <span className={s.micro} lang="en">02 / TOUCH</span><strong>현장 입력</strong>
          <dl>
            <div><dt>품목</dt><dd>자재 A</dd></div>
            <div><dt>불출 수량</dt><dd>12개</dd></div>
          </dl>
        </div>
      </div>
      <figcaption>같은 품목과 수량, 기기에 맞는 입력 방식 · 설명용 재구성</figcaption>
    </figure>
  );
}

export function TimingStudy({ timing }: { timing: TabTiming }) {
  const comparison = compareTabTiming(timing);
  if (!comparison) return null;
  const rows = [
    { label: "개선 전", value: timing.beforeMs, width: comparison.beforeWidthPercent },
    { label: "개선 후", value: timing.afterMs, width: comparison.afterWidthPercent },
  ];
  return (
    <figure className={s.timing}>
      <div className={s.micro} lang="en">TRACE 01  /  TAB SWITCH</div>
      <dl>
        {rows.map(({ label, value, width }) => (
          <div key={label} className={s.measure}>
            <dt>{label}</dt><dd>{value.toFixed(2)} ms</dd>
            <dd className={s.bar} aria-hidden="true" style={{ width: `${width}%` }} />
          </div>
        ))}
      </dl>
      <figcaption><strong>{comparison.reductionPercent.toFixed(1)}% 단축</strong> · {timing.conditions}</figcaption>
    </figure>
  );
}
