import type { PortfolioCase } from "@/common/data/cases";

export type CaseIntro = Readonly<{ summary: string; scope: string; role?: string }>;

export const introductions = {
  "manufacturing-performance": {
    summary: "탭을 오가도 입력값은 그대로 남기면서 보이지 않는 화면을 다시 그리는 일을 줄였습니다. 웹·키오스크·태블릿의 업무 규칙은 함께 쓰고 입력 방식은 기기에 맞게 나눴습니다.",
    scope: "멀티 디바이스 화면 구조 · 탭 전환 성능",
  },
  "payment-recovery": {
    summary: "결제창을 열고 돌아왔을 때, 화면에 어떤 주문 상태를 보여줘야 할까요? 결제 결과를 다시 확인하는 과정과 취소 요청을 구분한 사례입니다.",
    scope: "결제 재검증 · 주문 상태 표시",
  },
  "scada-interaction": {
    summary: "도면을 구성할 때 각 요소에 어떤 데이터를 연결할지 정해 둡니다. 사용자가 도면에서 한 요소를 누르면, 연결된 차트나 표가 그 요소에 지정된 데이터를 보여줍니다.",
    scope: "도면 요소 선택 · 대시보드 데이터 연결",
    role: "프론트엔드 개발 · 도면 뷰어와 대시보드 간 상호작용 연결",
  },
} satisfies Record<PortfolioCase["slug"], CaseIntro>;
