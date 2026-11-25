// 포트폴리오 예시: 두 도면 요소가 같은 키워드에 서로 다른 측정점을 연결한다.
export const readoutKeyword = "조회 지점";
export const axisMax = 20;

export const sources = {
  "point-01": {
    label: "측정점 01",
    samples: [{ time: "09:00", value: 8 }, { time: "10:00", value: 7 }],
  },
  "point-02": {
    label: "측정점 02",
    samples: [{ time: "09:00", value: 12 }, { time: "10:00", value: 18 }],
  },
} as const;

export const drawingElements = [
  { id: "a", label: "도형 A", bindings: { [readoutKeyword]: "point-02" } },
  { id: "b", label: "도형 B", bindings: { [readoutKeyword]: "point-01" } },
] as const satisfies readonly {
  id: string;
  label: string;
  bindings: Record<typeof readoutKeyword, keyof typeof sources>;
}[];

export type DrawingElement = (typeof drawingElements)[number];
export type MeasurementSource = (typeof sources)[keyof typeof sources];
