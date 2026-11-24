import { expect, test } from "@playwright/test";
import { cases, findCaseBySlug } from "@/common/data/cases";
import { compareTabTiming } from "@/common/data/tab-timing";

test("홈에 나열한 각 사례는 고유한 slug로 같은 상세 데이터를 찾는다", () => {
  expect(cases).toHaveLength(3);
  expect(new Set(cases.map(({ slug }) => slug)).size).toBe(cases.length);
  for (const item of cases) {
    expect(item.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(item.title.trim()).not.toBe("");
    expect(findCaseBySlug(item.slug)).toBe(item);
    if (item.tabTiming !== null) {
      expect(item.tabTiming.conditions.trim()).not.toBe("");
      expect(compareTabTiming(item.tabTiming)).not.toBeNull();
    }
  }
  expect(findCaseBySlug("manufacturing-performance")?.tabTiming).toBeTruthy();
  expect(findCaseBySlug("unknown-case")).toBeUndefined();
});

test("그래프는 가장 긴 막대가 100%이고, 단축률은 개선 전 시간을 기준으로 한다", () => {
  // 아래 값은 비율 계산 검증용으로 실제 사례의 측정값이 아니다.
  for (const [beforeMs, afterMs, beforeWidthPercent, afterWidthPercent, reductionPercent] of [
    [40, 10, 100, 25, 75],
    [10, 20, 50, 100, -100],
    [20, 20, 100, 100, 0],
    [10, 0, 100, 0, 100],
  ]) {
    expect(compareTabTiming({ beforeMs, afterMs })).toEqual({
      beforeWidthPercent, afterWidthPercent, reductionPercent,
    });
  }
  for (const [beforeMs, afterMs] of [[0, 1], [-1, 0], [2, -1], [NaN, 2], [1, Infinity]]) {
    expect(compareTabTiming({ beforeMs, afterMs })).toBeNull();
  }
});
