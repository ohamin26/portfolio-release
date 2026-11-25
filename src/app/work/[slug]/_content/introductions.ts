import type { PortfolioCase } from "@/common/data/cases";

export type CaseIntro = Readonly<{ summary: string; scope: string; role: string }>;

export const introductions = {
  "manufacturing-performance": {
    summary: "제조 현장에서는 같은 업무를 데스크톱과 터치 기기에서 처리합니다. 다른 업무 탭을 확인하고 돌아와도 작성 중인 내용은 그대로 남아야 합니다.",
    role: "설비 수리 화면에서 데이터 처리와 기기별 UI를 분리하고, 탭을 전환할 때 보이지 않는 화면까지 다시 그리는 일을 줄였습니다.",
    scope: "멀티 디바이스 화면 구조 · 탭 전환 성능",
  },
  "payment-recovery": {
    summary: "카드 결제가 승인돼도 주문까지 끝난 것은 아닙니다. 주문 완료 요청까지 성공해야 사용자가 완료 화면을 볼 수 있습니다.",
    role: "사용자 웹에서 승인 전 검증이 실패하면 선주문 취소를 요청하고, 승인 후 주문 완료에 실패하면 오류를 안내하도록 구현했습니다.",
    scope: "구매 가능 수량 확인 · 결제 승인과 주문 확정",
  },
  "scada-interaction": {
    summary: "도면을 구성할 때 각 요소에 어떤 데이터를 연결할지 정해 둡니다. 사용자가 도면에서 한 요소를 누르면, 연결된 차트나 표가 그 요소에 지정된 데이터를 보여줍니다.",
    scope: "도면 요소 선택 · 대시보드 데이터 연결",
    role: "도면에서 고른 요소에 맞춰 대시보드의 차트와 표가 조회할 데이터를 바꾸도록 구현했습니다.",
  },
} satisfies Record<PortfolioCase["slug"], CaseIntro>;
