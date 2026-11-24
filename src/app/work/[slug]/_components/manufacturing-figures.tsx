import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { compareTabTiming, type TabTiming } from "@/common/data/tab-timing";
import s from "./manufacturing.module.css";

const material = { name: "자재 A", quantity: "12개" };

export function DeviceComparison() {
  return (
    <figure className={s.figure}>
      <p className={s.label} lang="en">FIG. 01 / SHARED VALIDATION</p>
      <div className={s.devices}>
        <div className={s.device}>
          <span className={s.label} lang="en">A / DESKTOP</span>
          <h3>자재 불출</h3>
          <Table aria-label="데스크톱 자재 불출 예시" className="text-[.9rem]">
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead scope="col">품목</TableHead>
                <TableHead scope="col" className="text-right">불출 수량</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{material.name}</TableCell>
                <TableCell className="text-right font-[650]">{material.quantity}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={s.device}>
          <span className={s.label} lang="en">B / TOUCH</span>
          <h3>현장 입력</h3>
          <dl className={s.touchFields}>
            <div><dt>품목</dt><dd>{material.name}</dd></div>
            <div><dt>불출 수량</dt><dd>{material.quantity}</dd></div>
          </dl>
        </div>
      </div>
      <figcaption>같은 품목과 수량을 표와 터치 입력 화면으로 재구성한 예시</figcaption>
    </figure>
  );
}

export function TabComparison({ timing }: { timing: TabTiming }) {
  const result = compareTabTiming(timing);
  if (!result) return null;

  const rows = [
    { label: "개선 전", value: timing.beforeMs, percent: result.beforeWidthPercent },
    { label: "개선 후", value: timing.afterMs, percent: result.afterWidthPercent },
  ];
  return (
    <figure className={s.trace}>
      <p className={s.label} lang="en">TRACE / TAB SWITCH</p>
      <div className={s.comparison}>
        <strong className={s.result}>{result.reductionPercent.toFixed(1)}% 단축</strong>
        <dl className={s.rows}>
          {rows.map(({ label, value, percent }) => (
            <div key={label} className={s.row}>
              <dt>{label}</dt>
              <dd>
                {value.toFixed(2)} ms
                <span aria-hidden="true" className={s.track}>
                  <span style={{ width: `${percent}%` }} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption>{timing.conditions}</figcaption>
    </figure>
  );
}
