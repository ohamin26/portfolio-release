import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { compareTabTiming, type TabTiming } from "@/common/data/tab-timing";
import { cn } from "@/common/lib/utils";
import { figureCaption, figureFrame, studyLabel } from "./study-styles";

const material = { name: "자재 A", quantity: "12개" };
const deviceCard = "rounded-sm border border-border bg-background p-[clamp(14px,2vw,22px)]";
const deviceTitle = "mt-1 mb-3 text-[1.1rem] font-[680]";
const tableHead = "px-2 text-[length:inherit] leading-[inherit] font-[550] text-foreground";
const touchRow = "flex justify-between gap-2 px-2.5 py-[7px]";

export function DeviceComparison() {
  return (
    <figure className={cn(figureFrame, "bg-muted")}>
      <p className={studyLabel} lang="en">FIG. 01 / SHARED VALIDATION</p>
      <div className="mt-3.5 grid grid-cols-1 gap-2.5 figure-wide:grid-cols-2 figure-wide:gap-3.5">
        <div className={deviceCard}>
          <span className={studyLabel} lang="en">A / DESKTOP</span>
          <h3 className={deviceTitle}>자재 불출</h3>
          <Table aria-label="데스크톱 자재 불출 예시" className="text-[.9rem]">
            <TableHeader className="bg-muted [&_tr]:border-b-0">
              <TableRow>
                <TableHead scope="col" className={tableHead}>품목</TableHead>
                <TableHead scope="col" className={cn(tableHead, "text-right")}>불출 수량</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-b">
              <TableRow>
                <TableCell className="px-2">{material.name}</TableCell>
                <TableCell className="px-2 text-right font-[650]">{material.quantity}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={deviceCard}>
          <span className={studyLabel} lang="en">B / TOUCH</span>
          <h3 className={deviceTitle}>현장 입력</h3>
          <dl className="grid gap-1.5 text-[.9rem]">
            <div className={touchRow}><dt>품목</dt><dd className="font-[650]">{material.name}</dd></div>
            <div className={cn(touchRow, "bg-highlight text-[#20439a]")}><dt>불출 수량</dt><dd className="font-[650]">{material.quantity}</dd></div>
          </dl>
        </div>
      </div>
      <figcaption className={figureCaption}>같은 품목과 수량을 표와 터치 입력 화면으로 재구성한 예시</figcaption>
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
    <figure className={cn(figureFrame, "bg-highlight")}>
      <p className={studyLabel} lang="en">TRACE / TAB SWITCH</p>
      <div className="mt-4 grid grid-cols-1 items-center gap-5 figure-wide:grid-cols-[auto_minmax(0,1fr)] figure-wide:gap-[clamp(22px,5vw,70px)]">
        <strong className="text-[clamp(1.7rem,3.5vw,3.25rem)] leading-[1.2] font-bold tracking-[-.06em] text-ring tabular-nums">{result.reductionPercent.toFixed(1)}% 단축</strong>
        <dl className="grid gap-3.5">
          {rows.map(({ label, value, percent }) => (
            <div key={label} className="group relative grid grid-cols-[1fr_auto] items-baseline gap-[5px] pb-3 text-[.85rem]">
              <dt>{label}</dt>
              <dd className="font-mono text-[.95rem] leading-[1.4] font-semibold">
                {value.toFixed(2)} ms
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[7px] bg-[#d4dceb]">
                  <span className="block h-full bg-[#737f90] group-last:bg-ring" style={{ width: `${percent}%` }} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption className={figureCaption}>{timing.conditions}</figcaption>
    </figure>
  );
}
