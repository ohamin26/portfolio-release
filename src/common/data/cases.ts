import type { TabTiming } from "./tab-timing";

type CaseSummary = Readonly<{
  slug: string;
  title: string;
  role: string;
  field: string;
  tabTiming: TabTiming | null;
}>;

// 홈은 이 순서를 사용하고, 상세는 같은 항목을 slug로 조회한다.
// 공개할 측정값이 없는 경우에는 null로 두며, 추정값으로 대체하지 않는다.
export const cases = [
  {
    slug: "manufacturing-performance",
    role: "설비 수리 화면에서 데이터 처리와 기기별 UI를 분리하고, 탭을 전환할 때 보이지 않는 화면까지 다시 그리는 일을 줄였습니다.",
    field: "제조 현장",
    title: "탭 하나 바꿨는데, 왜 보이지 않는 화면까지 다시 그릴까?",
    tabTiming: {
      beforeMs: 14.50,
      afterMs: 2.60,
      conditions: "탭 10개 · 클릭 후 대상 탭 표시 감지 시간 중앙값",
    },
  },
  {
    slug: "payment-recovery",
    role: "사용자 웹에서 승인 전 검증이 실패하면 선주문 취소를 요청하고, 승인 후 주문 완료에 실패하면 오류를 안내하도록 구현했습니다.",
    field: "정비 서비스",
    title: "결제가 끝나지 않았을 때, 주문은 어떻게 될까?",
    tabTiming: null,
  },
  {
    slug: "scada-interaction",
    role: "도면에서 고른 요소에 맞춰 대시보드의 차트와 표가 조회할 데이터를 바꾸도록 구현했습니다.",
    field: "산업 모니터링",
    title: "설비 도면에서 고른 대상은 차트에 어떻게 연결될까?",
    tabTiming: null,
  },
] as const satisfies readonly CaseSummary[];

export type PortfolioCase = (typeof cases)[number];

export function findCaseBySlug(slug: string) {
  return cases.find((item) => item.slug === slug);
}
