import type { PortfolioCase } from "@/common/data/cases";

export type CaseIntro = Readonly<{ summary: string; scope: string; role?: string }>;

export const introductions = {
  "manufacturing-performance": {
    summary: "탭을 오가도 입력값은 그대로 남기면서 보이지 않는 화면을 다시 그리는 일을 줄였습니다. 웹·키오스크·태블릿의 업무 규칙은 함께 쓰고 입력 방식은 기기에 맞게 나눴습니다.",
    scope: "멀티 디바이스 화면 구조 · 탭 전환 성능",
  },
  "payment-recovery": {
    summary: "카드 결제가 승인돼도 주문까지 끝난 것은 아닙니다. 사용자 웹에서 승인 전 검증이 실패하면 선주문 취소를 요청하고, 승인 후에는 주문 완료 요청의 결과에 따라 완료 화면과 오류 안내를 구분했습니다.",
    scope: "구매 가능 수량 확인 · 결제 승인과 주문 확정",
  },
  "scada-interaction": {
    summary: "도면을 구성할 때 각 요소에 어떤 데이터를 연결할지 정해 둡니다. 사용자가 도면에서 한 요소를 누르면, 연결된 차트나 표가 그 요소에 지정된 데이터를 보여줍니다.",
    scope: "도면 요소 선택 · 대시보드 데이터 연결",
    role: "프론트엔드 개발 · 도면 뷰어와 대시보드 간 상호작용 연결",
  },
} satisfies Record<PortfolioCase["slug"], CaseIntro>;
