import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { compareTabTiming, type TabTiming } from "@/common/data/tab-timing";
import { microLabel } from "./home-typography";

const figureFrame = "rounded-[5px] p-[clamp(16px,1.8vw,26px)]";
const caption = "text-[.8rem] leading-[1.65] text-muted-foreground";
const deviceCard = "min-w-0 rounded-sm border border-border bg-background p-3.5";
const deviceTitle = "mt-1.5 mb-3 block";
const tableHead = "pt-[5px] pb-0 text-[length:inherit] leading-[inherit]";
const fieldRow = "flex justify-between gap-1.5 pt-[5px] text-[.8rem]";

export function DeviceStudy() {
  return (
    <figure className={`${figureFrame} bg-muted`}>
      <div className={microLabel} lang="en">FIG. 02  /  DEVICE COMPARISON</div>
      <div className="my-2.5 grid grid-cols-2 gap-3 home-narrow:grid-cols-1">
        <div className={deviceCard}>
          <span className={microLabel} lang="en">01 / DESKTOP</span><strong className={deviceTitle}>자재 불출</strong>
          <Table aria-label="자재 불출" className="text-[.8rem]">
            <TableHeader className="[&_tr]:border-0">
              <TableRow>
                <TableHead scope="col" className={tableHead}>품목</TableHead>
                <TableHead scope="col" className={`${tableHead} text-right`}>수량</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pt-[5px] pb-0">자재 A</TableCell>
                <TableCell className="pt-[5px] pb-0 text-right font-semibold">12개</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={deviceCard}>
          <span className={microLabel} lang="en">02 / TOUCH</span><strong className={deviceTitle}>현장 입력</strong>
          <dl>
            <div className={fieldRow}><dt className="text-muted-foreground">품목</dt><dd className="font-semibold">자재 A</dd></div>
            <div className={fieldRow}><dt className="text-muted-foreground">불출 수량</dt><dd className="font-semibold">12개</dd></div>
          </dl>
        </div>
      </div>
      <figcaption className={caption}>같은 품목과 수량, 기기에 맞는 입력 방식 · 설명용 재구성</figcaption>
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
    <figure className={`${figureFrame} bg-highlight`}>
      <div className={microLabel} lang="en">TRACE 01  /  TAB SWITCH</div>
      <dl>
        {rows.map(({ label, value, width }) => (
          <div key={label} className="my-3 grid grid-cols-[1fr_auto] items-baseline gap-[5px] text-[#525e6d] last:text-ring">
            <dt className="text-[.75rem]">{label}</dt><dd className="font-mono text-[.95rem] font-[550] leading-[1.4]">{value.toFixed(2)} ms</dd>
            <dd className="col-span-full h-1.5 bg-current" aria-hidden="true" style={{ width: `${width}%` }} />
          </div>
        ))}
      </dl>
      <figcaption className={caption}><strong>{comparison.reductionPercent.toFixed(1)}% 단축</strong> · {timing.conditions}</figcaption>
    </figure>
  );
}
