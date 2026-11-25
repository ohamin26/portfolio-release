"use client";

import { useState, type ReactNode } from "react";
import { drawingElements, readoutKeyword, sources, type DrawingElement } from "../_content/scada-example";
import { ScadaDiagram } from "./scada-diagram";
import { ScadaReadings } from "./scada-readings";
import { figureFrame, studyLabel } from "./study-styles";

export function ScadaExplorer({ settings }: { settings: ReactNode }) {
  const [selected, setSelected] = useState<DrawingElement>(drawingElements[0]);
  const source = sources[selected.bindings[readoutKeyword]];

  return (
    <div className={`${figureFrame} grid gap-5 bg-muted`}>
      <header>
        <p className={studyLabel}>연동 예시</p>
        <h3 className="mt-1 text-xl font-bold">도면에서 조회 대상 바꾸기</h3>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          두 도형이 같은 ‘{readoutKeyword}’ 키워드에 서로 다른 측정점을 연결한 예시입니다.
        </p>
      </header>
      <div className="grid items-start gap-4 figure-wide:grid-cols-2">
        <div className="min-w-0 rounded-sm border border-border bg-background p-4">{settings}</div>
        <div className="min-w-0">
          <p id="drawing-hint" className="mb-2 text-sm font-semibold">설비 도면에서 도형을 선택해 보세요.</p>
          <ScadaDiagram selected={selected} onSelect={setSelected} />
        </div>
      </div>
      <p role="status" className="border-t border-border pt-4 text-sm text-body">
        선택: <strong>{selected.label}</strong> · 조회 대상: <strong>{source.label}</strong>
      </p>
      <ScadaReadings source={source} />
    </div>
  );
}
