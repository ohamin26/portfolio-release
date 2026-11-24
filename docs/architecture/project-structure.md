# 소스 구조와 경로

화면은 라우트가 소유하고, 화면을 몰라도 되는 코드만 `src/common/`에 둔다. `@/*`는 저장소 루트가 아니라 `src/*`를 가리킨다.

| 위치 | 무엇을 두는가 |
| --- | --- |
| `src/app/` | Next.js App Router의 유일한 시작점. 루트 레이아웃은 전역 CSS를 한 번 불러온다. 루트의 `app/`, `pages/` 또는 `src/pages/`를 병행하지 않는다. |
| `src/app/<라우트>/_components/` | 해당 화면과 전용 섹션. 화면을 추가할 때 `page.tsx`는 같은 라우트의 Screen을 조립하는 얇은 진입점으로 둔다. 홈은 `src/app/_components/`를 쓴다. |
| `src/common/components/ui/` | 도메인에 의존하지 않는 공용 UI와 shadcn 컴포넌트의 생성 위치. 첫 컴포넌트가 생길 때 만든다. |
| `src/common/styles/globals.css` | Tailwind v4 진입점이자 shadcn의 스타일 대상. 클래스 탐색은 `src/`로 한정한다. |

라우트에서 공용 코드는 `@/common/…`로 가져오고, 같은 라우트의 전용 코드는 `./_components/…`로 가져온다. 다른 화면의 전용 모듈을 직접 가져오지 않는다. 두 화면이 같은 기능을 써야 한다면 공용 부분만 추출한다. ESLint는 `src/common/`에서 `src/app/`으로의 정적 import와 재수출을 검사한다.

[TypeScript](../../tsconfig.json)의 별칭과 [shadcn 설정](../../components.json)의 생성 경로를 함께 유지한다. `utils`, `lib`, `hooks` 별칭은 생성 위치를 예약한 것이며 구현이 있다는 뜻은 아니다. 데이터 계층이나 전역 스토어도 실제 소비자가 생기기 전에 만들지 않는다.

현재 서비스 경로는 `GET /health`뿐이다. 홈·사례 페이지, 공용 버튼·데이터는 후속 이슈에서 이 구조에 맞춰 추가한다.
