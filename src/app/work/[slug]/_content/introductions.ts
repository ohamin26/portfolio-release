import type { PortfolioCase } from "@/common/data/cases";

export type CaseIntro = Readonly<{ summary: string; scope: string }>;

export const introductions = {
  "manufacturing-performance": {
    summary: "탭을 오가도 입력값은 그대로 남기면서 보이지 않는 화면을 다시 그리는 일을 줄였습니다. 웹·키오스크·태블릿의 업무 규칙은 함께 쓰고 입력 방식은 기기에 맞게 나눴습니다.",
    scope: "멀티 디바이스 화면 구조 · 탭 전환 성능",
  },
  "payment-recovery": {
    summary: "결제창을 열고 돌아왔을 때, 화면에 어떤 주문 상태를 보여줘야 할까요? 결제 결과를 다시 확인하는 과정과 취소 요청을 구분한 사례입니다.",
    scope: "결제 재검증 · 주문 상태 표시",
  },
  "equipment-selection": {
    summary: "차트에서 설비 하나를 고르면 연관된 표도 같은 설비를 보여줘야 합니다. 선택한 설비가 다음 조회의 기준이 되도록 화면을 연결한 사례입니다.",
    scope: "차트 선택 · 연관 데이터 조회",
  },
} satisfies Record<PortfolioCase["slug"], CaseIntro>;
