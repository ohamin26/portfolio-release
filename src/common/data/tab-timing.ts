/** 탭을 클릭한 뒤 대상 탭의 표시를 감지하기까지 걸린 시간의 중앙값(ms). */
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
