import type { TabTiming } from "./tab-timing";

type CaseSummary = Readonly<{
  slug: string;
  title: string;
  field: string;
  tabTiming: TabTiming | null;
}>;

// 홈은 이 순서를 사용하고, 상세는 같은 항목을 slug로 조회한다.
// 공개할 측정값이 없는 경우에는 null로 두며, 추정값으로 대체하지 않는다.
export const cases = [
  {
    slug: "manufacturing-performance",
    field: "제조 현장",
    title: "탭 하나 바꿨는데, 왜 보이지 않는 화면까지 다시 그릴까?",
    tabTiming: {
      beforeMs: 14.50,
      afterMs: 2.60,
      conditions: "탭 10개 · 탭 전환 시간 중앙값",
    },
  },
  {
    slug: "payment-recovery",
    field: "정비 서비스",
    title: "결제가 끝나지 않았을 때, 주문은 어떻게 될까?",
    tabTiming: null,
  },
  {
    slug: "equipment-selection",
    field: "산업 모니터링",
    title: "차트에서 설비 하나를 선택하면 무엇이 달라질까?",
    tabTiming: null,
  },
] as const satisfies readonly CaseSummary[];

export type PortfolioCase = (typeof cases)[number];

export function findCaseBySlug(slug: string) {
  return cases.find((item) => item.slug === slug);
}
