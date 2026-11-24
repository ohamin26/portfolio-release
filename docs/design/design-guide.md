# 디자인 기준

프로필 중심 A안을 따른다. 흰 바탕, 명확한 제목·본문 위계, 얇은 구분선을 기본으로 하고 강조색은 링크와 필요한 정보에만 사용한다.

- 휴대폰에서도 소개 → 대표 작업 → 사례 상세 → 목록 복귀를 같은 순서로 읽을 수 있어야 한다. 비교 도해는 글자를 작게 축소하는 대신 세로로 재배치한다.
- 키보드 포커스가 보이고, 모션 감소 설정에서도 모든 정보와 행동을 제공한다. 자동 재생이나 스크롤 가로채기는 사용하지 않는다.
- 공용 UI는 shadcn/ui를, 화면 배치와 반응형은 Tailwind CSS를 사용한다. 공용 버튼은 최소 높이 44px, 키보드 포커스 테두리, 모션 감소 지원을 기본으로 한다. 페이지 이동에는 버튼 대신 같은 스타일의 링크를 쓴다.

## 공용 UI 적용 기준

[설정](../../components.json)은 `new-york`·`neutral`이며 Tailwind v4용 공식 레지스트리 [Button](https://ui.shadcn.com/r/styles/new-york-v4/button.json) · [RadioGroup](https://ui.shadcn.com/r/styles/new-york-v4/radio-group.json) · [Table](https://ui.shadcn.com/r/styles/new-york-v4/table.json)을 프로젝트에 복사해 A안에 맞췄다. [원본 라이선스](../licenses/shadcn-ui.md)를 함께 보관한다.

| 화면 | 공용 UI와 적용 방식 |
| --- | --- |
| 홈의 ‘대표 작업 보기’, 상세의 ‘대표 작업 목록으로’ | Button의 `asChild`로 실제 링크 하나만 렌더링한다. 이동과 버튼 동작을 혼동하지 않는다. |
| 산업 모니터링 사례의 설비 선택 | 이름이 있는 RadioGroup에서 방향키 또는 터치로 선택한다. 선택 상태와 조회 기준은 사례 화면에 둔다. |
| 홈·제조 상세의 자재 예시, 산업 모니터링 상세의 수집 내역 | Table이 네이티브 표·열 머리글을 유지한다. 접근 가능한 표 이름과 행 데이터는 화면이 제공한다. |

Button은 CVA(`class-variance-authority`)로 변형을 정의하고 Radix Slot(`@radix-ui/react-slot`)으로 자식 링크에 스타일을 적용한다. RadioGroup은 `@radix-ui/react-radio-group`을 사용하고 선택 표식은 CSS로 그린다. Table에는 클라이언트 지시문이나 런타임 패키지가 필요 없다.

공용 색과 포커스는 [globals.css](../../src/common/styles/globals.css)의 CSS 변수와 Tailwind `@theme inline`으로 연결한다.

## 화면 레이아웃과 반응형

홈과 세 사례 상세는 각 라우트의 컴포넌트에 Tailwind 유틸리티를 적용한다. 여러 화면에서 쓰는 색·글꼴은 공용 테마에서 가져오고, 사례 장 제목이나 도해처럼 해당 라우트에서만 반복되는 스타일은 라우트 안에서 공유한다. 데이터에 따라 길이가 달라지는 막대만 계산한 너비를 인라인 스타일로 전달한다.

- 홈은 800px 이하에서 프로필과 대표 사례를 한 열로, 550px 이하에서 기기 비교를 표 다음에 터치 입력 예시가 오도록 배치한다.
- 상세는 600px 이하에서 역할·작업 범위를 위아래로 보여준다. 도해는 640px 이하에서 한 열, 그보다 넓을 때 나란히 배치한다.
- 이 경계에서 반복되는 Tailwind 변형은 [globals.css](../../src/common/styles/globals.css)에 정의한다. 새 화면에 별도의 CSS 모듈이나 클라이언트 상태를 추가해 같은 반응형 규칙을 다시 만들지 않는다.

[모바일·데스크톱 전환 전후 화면 비교](evidence/tailwind-layout-comparison.webp)
