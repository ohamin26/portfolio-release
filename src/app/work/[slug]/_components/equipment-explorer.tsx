"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { cn } from "@/common/lib/utils";
import { figureFrame, studyLabel } from "./study-styles";

const equipment = ["설비 A", "설비 B"] as const;
const scopes = ["전체 설비", ...equipment] as const;
type Scope = (typeof scopes)[number];

const samples = [
  { time: "09:00", counts: { "설비 A": 12, "설비 B": 8 } },
  { time: "10:00", counts: { "설비 A": 18, "설비 B": 7 } },
] as const;
const axisMax = 30;
const resultCard = "min-w-0 rounded-sm border border-border bg-background p-[clamp(14px,2vw,24px)]";

export function EquipmentExplorer() {
  const [scope, setScope] = useState<Scope>("전체 설비");
  const visibleEquipment = equipment.filter((name) => scope === "전체 설비" || name === scope);

  return (
    <div className={cn(figureFrame, "bg-muted")}>
      <p className={studyLabel}>예시 데이터</p>
      <div className="mt-1.5 min-w-0">
        <h3 id="scope-title" className="text-[1.2rem] font-bold">설비 선택</h3>
        <p id="scope-hint" className="mt-1 leading-[1.65] text-muted-foreground">
          전체 합계를 살펴본 뒤, 설비 하나를 골라 차트와 표를 비교해 보세요.
        </p>
        <RadioGroup
          aria-labelledby="scope-title"
          aria-describedby="scope-hint"
          value={scope}
          onValueChange={(value) => {
            const selected = scopes.find((name) => name === value);
            if (selected) setScope(selected);
          }}
          className="mt-3.5 mb-5 flex flex-wrap gap-2"
        >
          {scopes.map((name, index) => (
            <label
              key={name}
              htmlFor={`scope-${index}`}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border border-input bg-background px-3 py-1.5 has-aria-checked:border-ring has-aria-checked:font-[650] has-aria-checked:text-selection has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ring"
            >
              <RadioGroupItem
                id={`scope-${index}`}
                value={name}
                // 짧게 누른 방향키를 떼고 포커스가 도착해도 차트가 이전 설비에 남지 않게 한다.
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) setScope(name);
                }}
                className="focus-visible:outline-none"
              />
              {name}
            </label>
          ))}
        </RadioGroup>
      </div>
      <p className="sr-only" role="status">{scope} 기준으로 차트와 표를 표시합니다.</p>
      <div className="grid grid-cols-1 items-start gap-3.5 figure-wide:grid-cols-2">
        <figure className={resultCard}>
          <figcaption className="mb-4 text-left font-[680]">{scope} · 시간대별 수집 건수</figcaption>
          <dl className="space-y-3 tabular-nums">
            {samples.map(({ time, counts }) => {
              const total = visibleEquipment.reduce((sum, name) => sum + counts[name], 0);
              return (
                <div key={time}>
                  <dt className="text-[.875rem] text-muted-foreground">{time}</dt>
                  <dd className="grid grid-cols-[minmax(0,1fr)_4ch] items-center gap-3 text-right font-[650] whitespace-nowrap">
                    <span className="block h-2 bg-[#e8ecf2]" aria-hidden="true">
                      <span className="block h-full bg-ring" style={{ width: `${total / axisMax * 100}%` }} />
                    </span>
                    {total}건
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-4 text-[.875rem] text-muted-foreground">차트 눈금: 0–{axisMax}건</p>
        </figure>
        <div className={resultCard}>
          <Table className="tabular-nums">
            <TableCaption>{scope} · 수집 내역</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">시간</TableHead>
                <TableHead scope="col">설비</TableHead>
                <TableHead scope="col" className="text-right">수집 건수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.flatMap(({ time, counts }) => visibleEquipment.map((name) => (
                <TableRow key={`${time}-${name}`}>
                  <TableCell>{time}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell className="text-right">{counts[name]}건</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
