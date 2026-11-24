/** 한 조건에서 측정한 탭 전환 시간. 측정 조건을 수치와 함께 전달한다. */
export type TabTiming = Readonly<{
  beforeMs: number;
  afterMs: number;
  conditions: string;
}>;

export function compareTabTiming({ beforeMs, afterMs }: Pick<TabTiming, "beforeMs" | "afterMs">) {
  if (!Number.isFinite(beforeMs) || !Number.isFinite(afterMs) || beforeMs <= 0 || afterMs < 0) {
    return null;
  }

  const longest = Math.max(beforeMs, afterMs);
  return {
    beforeWidthPercent: (beforeMs / longest) * 100,
    afterWidthPercent: (afterMs / longest) * 100,
    reductionPercent: ((beforeMs - afterMs) / beforeMs) * 100,
  };
}
