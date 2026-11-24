# 소스 구조와 경로

화면은 라우트가 소유하고, 화면을 몰라도 되는 코드만 `src/common/`에 둔다. `@/*`는 저장소 루트가 아니라 `src/*`를 가리킨다.

| 위치 | 무엇을 두는가 |
| --- | --- |
| `src/app/` | Next.js App Router의 유일한 시작점. 루트 레이아웃은 전역 CSS를 한 번 불러온다. 루트의 `app/`, `pages/` 또는 `src/pages/`를 병행하지 않는다. |
| `src/app/<라우트>/_components/` | 해당 화면과 전용 섹션. 화면을 추가할 때 `page.tsx`는 같은 라우트의 Screen을 조립하는 얇은 진입점으로 둔다. 홈은 `src/app/_components/`를 쓴다. |
| `src/common/components/ui/` | [Button과 buttonVariants](../../src/common/components/ui/button.tsx)가 있다. 동작은 버튼, 이동은 같은 스타일의 링크로 표현한다. |
| `src/common/data/` | [사례 목록과 slug 조회](../../src/common/data/cases.ts), [탭 전환 시간 비교](../../src/common/data/tab-timing.ts). 화면별 설명·도해는 여기에 넣지 않는다. |
| `src/common/styles/globals.css` | Tailwind v4 진입점이자 shadcn의 스타일 대상. 클래스 탐색은 `src/`로 한정한다. |

라우트에서 공용 코드는 `@/common/…`로 가져오고, 같은 라우트의 전용 코드는 `./_components/…`로 가져온다. 다른 화면의 전용 모듈을 직접 가져오지 않는다. 두 화면이 같은 기능을 써야 한다면 공용 부분만 추출한다. ESLint는 `src/common/`에서 `src/app/`으로의 정적 import와 재수출을 검사한다.

[TypeScript](../../tsconfig.json)의 별칭과 [shadcn 설정](../../components.json)의 생성 경로를 함께 유지한다. `utils`는 [클래스 병합 함수 cn](../../src/common/lib/utils.ts)을 가리킨다. `hooks` 별칭은 생성 위치를 예약한 것이며 구현이 있다는 뜻은 아니다.

홈은 `cases`의 순서와 제목을, 상세는 `findCaseBySlug(slug)`가 돌려주는 같은 항목을 사용한다. `tabTiming`이 없으면 수치나 그래프를 표시하지 않는다. 있으면 `compareTabTiming`으로 막대 너비와 단축률을 계산하고, 측정 조건을 수치와 함께 보여준다. 소수 자릿수는 표시할 때만 반올림한다.

`/`의 [라우트](../../src/app/page.tsx)는 메타데이터를 제공하고 [HomeScreen](../../src/app/_components/home-screen.tsx)을 연결한다. 프로필·대표 작업·도해와 스타일은 `src/app/_components/`에서 관리한다. `/health`는 화면과 독립된 상태 확인 경로다.
