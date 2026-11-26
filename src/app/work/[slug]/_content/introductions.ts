import type { PortfolioCase } from "@/common/data/cases";

export type CaseIntro = Readonly<{ summary: string; scope: string }>;

export const introductions = {
  "manufacturing-performance": {
    summary: "제조 현장에서는 같은 업무를 데스크톱과 터치 기기에서 처리합니다. 다른 업무 탭을 확인하고 돌아와도 작성 중인 내용은 그대로 남아야 합니다.",
    scope: "멀티 디바이스 화면 구조 · 탭 전환 성능",
  },
  "payment-recovery": {
    summary: "카드 결제가 승인돼도 주문까지 끝난 것은 아닙니다. 주문 완료 요청까지 성공해야 사용자가 완료 화면을 볼 수 있습니다.",
    scope: "구매 가능 수량 확인 · 결제 승인과 주문 확정",
  },
  "scada-interaction": {
    summary: "도면을 구성할 때 각 요소에 어떤 데이터를 연결할지 정해 둡니다. 사용자가 도면에서 한 요소를 누르면, 연결된 차트나 표가 그 요소에 지정된 데이터를 보여줍니다.",
    scope: "도면 요소 선택 · 대시보드 데이터 연결",
  },
} satisfies Record<PortfolioCase["slug"], CaseIntro>;
