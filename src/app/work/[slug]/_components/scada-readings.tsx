import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { axisMax, type MeasurementSource } from "../_content/scada-example";

const resultCard = "min-w-0 rounded-sm border border-border bg-background p-4";

export function ScadaReadings({ source }: { source: MeasurementSource }) {
  return (
    <div className="grid items-start gap-4 figure-wide:grid-cols-2">
      <figure className={resultCard}>
        <figcaption className="mb-4 font-semibold">{source.label} · 시간별 예시 값</figcaption>
        <dl className="space-y-3 tabular-nums">
          {source.samples.map(({ time, value }) => (
            <div key={time}>
              <dt className="text-sm text-muted-foreground">{time}</dt>
              <dd className="grid grid-cols-[1fr_3ch] items-center gap-3 text-right font-semibold">
                <span aria-hidden="true" className="block h-2 bg-muted">
                  <span
                    className="block h-full origin-left bg-ring motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
                    style={{ transform: `scaleX(${value / axisMax})` }}
                  />
                </span>
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">차트 눈금: 0–{axisMax}</p>
      </figure>
      <div className={resultCard}>
        <Table className="tabular-nums">
          <TableCaption>{source.label} · 조회 내역</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">시간</TableHead>
              <TableHead scope="col" className="text-right">예시 값</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {source.samples.map(({ time, value }) => (
              <TableRow key={time}>
                <TableCell>{time}</TableCell>
                <TableCell className="text-right">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
