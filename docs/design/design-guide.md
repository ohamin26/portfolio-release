# 디자인 기준

프로필 중심 A안을 따른다. 흰 바탕, 명확한 제목·본문 위계, 얇은 구분선을 기본으로 하고 강조색은 링크와 필요한 정보에만 사용한다.

- 휴대폰에서도 소개 → 대표 작업 → 사례 상세 → 목록 복귀를 같은 순서로 읽을 수 있어야 한다. 비교 도해는 글자를 작게 축소하는 대신 세로로 재배치한다.
- 키보드 포커스가 보이고, 모션 감소 설정에서도 모든 정보와 행동을 제공한다. 자동 재생이나 스크롤 가로채기는 사용하지 않는다.
- 후속 화면은 Tailwind CSS와 shadcn/ui를 바탕으로 만든다. 공용 버튼은 최소 높이 44px, 키보드 포커스 테두리, 모션 감소 지원을 기본으로 한다. 페이지 이동에는 버튼 대신 같은 스타일의 링크를 쓴다.

## 공용 UI 적용 기준

[설정](../../components.json)은 `new-york`·`neutral`이며 Tailwind v4용 공식 레지스트리 [Button](https://ui.shadcn.com/r/styles/new-york-v4/button.json) · [RadioGroup](https://ui.shadcn.com/r/styles/new-york-v4/radio-group.json) · [Table](https://ui.shadcn.com/r/styles/new-york-v4/table.json)을 프로젝트에 복사해 A안에 맞췄다. [원본 라이선스](../licenses/shadcn-ui.md)를 함께 보관한다.

| 화면 | 공용 UI와 적용 방식 |
| --- | --- |
| 홈의 ‘대표 작업 보기’, 상세의 ‘대표 작업 목록으로’ | Button의 `asChild`로 실제 링크 하나만 렌더링한다. 이동과 버튼 동작을 혼동하지 않는다. |
| 산업 모니터링 사례의 설비 선택 | 이름이 있는 RadioGroup에서 방향키 또는 터치로 선택한다. 선택 상태와 조회 기준은 사례 화면에 둔다. |
| 홈·제조 상세의 자재 예시, 산업 모니터링 상세의 수집 내역 | Table이 네이티브 표·열 머리글을 유지한다. 접근 가능한 표 이름과 행 데이터는 화면이 제공한다. |

Button은 CVA(`class-variance-authority`)로 변형을 정의하고 Radix Slot(`@radix-ui/react-slot`)으로 자식 링크에 스타일을 적용한다. RadioGroup은 `@radix-ui/react-radio-group`을 사용하고 선택 표식은 CSS로 그린다. Table에는 클라이언트 지시문이나 런타임 패키지가 필요 없다.

공용 색과 포커스는 [globals.css](../../src/common/styles/globals.css)의 CSS 변수와 Tailwind `@theme inline`으로 연결한다. 화면별 배치와 도해는 이 공용 UI 변경에 포함하지 않는다.
