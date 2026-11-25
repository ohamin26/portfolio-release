# 소스 구조와 경로

화면은 라우트가 소유하고, 화면을 몰라도 되는 코드만 `src/common/`에 둔다. `@/*`는 저장소 루트가 아니라 `src/*`를 가리킨다.

| 위치 | 무엇을 두는가 |
| --- | --- |
| `src/app/` | Next.js App Router의 유일한 시작점. 루트 레이아웃은 전역 CSS를 한 번 불러온다. 루트의 `app/`, `pages/` 또는 `src/pages/`를 병행하지 않는다. |
| `src/app/<라우트>/_components/` | 해당 화면과 전용 섹션. 화면을 추가할 때 `page.tsx`는 같은 라우트의 Screen을 조립하는 얇은 진입점으로 둔다. 홈은 `src/app/_components/`를 쓴다. |
| `src/common/components/ui/` | shadcn/ui [Button](../../src/common/components/ui/button.tsx), [RadioGroup](../../src/common/components/ui/radio-group.tsx), [Table](../../src/common/components/ui/table.tsx)을 둔다. 이동은 Button의 `asChild`로 링크 의미를 보존한다. 선택 상태·표 데이터는 라우트에서 관리한다. |
| `src/common/components/ui/icons/` | 로고·일러스트의 SVG와 탐색 화살표의 모양을 관리한다. 배치·캡션·링크 동작은 사용하는 화면에 둔다. |
| `src/common/data/` | [사례 목록과 slug 조회](../../src/common/data/cases.ts), [탭 표시 감지 시간 비교](../../src/common/data/tab-timing.ts). 화면별 설명·도해는 여기에 넣지 않는다. |
| `src/common/styles/globals.css` | Tailwind v4 진입점이자 shadcn의 스타일 대상. 클래스 탐색은 `src/`로 한정한다. |

파일을 추가하거나 import 경로를 정할 때는 [폴더·파일명·모듈 진입점](module-conventions.md)을 따른다. 허용되는 직접 import 예시와 자동 검사·PR 리뷰의 범위도 그 문서에 있다.

[TypeScript](../../tsconfig.json)의 별칭과 [shadcn 설정](../../components.json)의 생성 경로를 함께 유지한다. `utils`는 [클래스 병합 함수 cn](../../src/common/lib/utils.ts)을 가리킨다. `hooks` 별칭은 생성 위치를 예약한 것이며 구현이 있다는 뜻은 아니다.

홈은 `cases`의 순서와 제목을, 상세는 `findCaseBySlug(slug)`가 돌려주는 같은 항목을 사용한다. `tabTiming`이 없으면 수치나 그래프를 표시하지 않는다. 있으면 `compareTabTiming`으로 막대 너비와 단축률을 계산하고, 측정 조건을 수치와 함께 보여준다. 소수 자릿수는 표시할 때만 반올림한다.

`/`의 [라우트](../../src/app/page.tsx)는 메타데이터를 제공하고 [HomeScreen](../../src/app/_components/home-screen.tsx)을 연결한다. 프로필·대표 작업·도해와 스타일은 `src/app/_components/`에서 관리한다. `/health`는 화면과 독립된 상태 확인 경로다.

`src/app/work/[slug]/page.tsx`는 공용 사례 목록으로 정적 경로를 생성하고, 사례별 메타데이터를 제공한다. 목록에 없는 slug는 HTTP 404다. 상세의 공통 읽기 화면은 해당 라우트의 `_components/`, 소개 문구는 `_content/`에 둔다. 홈 전용 모듈은 가져오지 않는다.

## 링크·이미지 선택 기준

- 다른 페이지로 이동할 때는 `next/link`를 우선한다. 사례 제목, 상세 상단의 홈 링크, 상세에서 홈 목록으로 돌아가는 `/#work`가 여기에 해당한다. 버튼처럼 보이는 링크도 `Button asChild` 안에 링크 하나만 둔다.
- 같은 문서 안의 `#work`, `#contact`, 본문 바로가기와 외부 LinkedIn 주소는 기본 `<a href>`를 사용한다.
- [본문 바로가기](../../src/common/components/ui/skip-link.tsx)는 본문 시작이 이미 보이면 스크롤하지 않고 포커스와 주소만 옮긴다. 다음 Tab으로 이동한 요소는 브라우저가 화면에 표시한다. 본문 시작이 화면 밖이거나 JavaScript를 사용할 수 없으면 기본 앵커가 동작한다.
- 상세에서 목록으로 돌아오면 제목이 보이는 것만으로는 부족하다. [WorkRegion](../../src/app/_components/work-region.tsx)은 `#work` 진입 시 포커스가 본문(body)에 남았을 때만 목록에 포커스를 준다. 스크롤은 Link에 맡긴다. 목록 내용은 서버 컴포넌트로 유지한다.
- 현재 화면에는 최적화할 사진 파일이 없다. 프로필 사진이나 프로젝트 스크린샷을 콘텐츠로 추가할 때는 `next/image` 적용을 검토한다. 인라인 SVG와 HTML 도표는 이미지로 바꾸지 않는다.
