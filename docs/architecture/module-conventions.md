# 폴더·파일명·모듈 진입점

**화면은 라우트가 조립하고, 공용 UI는 화면을 알지 않는다.** 파일명은 소문자 kebab-case, 컴포넌트 이름은 PascalCase로 쓴다. 폴더마다 `index.ts`를 만들지 않고, 아래에서 허용한 모듈 파일에서 직접 가져온다.

## 어디에 두고 어디서 가져오는가

| 대상 | 규칙 | 현재 코드의 예 |
| --- | --- | --- |
| 라우트 진입점 | `page.tsx`는 경로·메타데이터·데이터 선택을 담당하고 렌더링은 같은 라우트의 화면 컴포넌트에 맡긴다. 화면 컴포넌트를 다른 라우트의 진입점으로 쓰지 않는다. | 홈의 `page.tsx` → `./_components/home-screen` |
| 라우트 전용 모듈 | 섹션·상호작용은 `_components/`, 해당 라우트만의 설명·예시 데이터는 `_content/`에 둔다. 같은 라우트 안에서는 상대 경로로 가져온다. | 상세의 `_components/scada-explorer.tsx` → `./scada-diagram`, `../_content/scada-example` |
| 공용 UI와 아이콘 | shadcn 기반 UI와 SVG 아이콘은 `src/common/components/ui/`에 둔다. 문구·선택 상태·이동 목적지는 사용하는 화면이 정한다. 화면 전용 섹션은 UI 폴더로 옮기지 않는다. | 상세의 `case-screen.tsx`는 `@/common/components/ui/button`과 `@/common/components/ui/icons/navigation-arrow`를 가져와 링크를 조립한다. |
| 공용 데이터·유틸리티 | 라우트에서 공용 모듈은 `@/common/…`로 가져온다. 공용 모듈끼리도 의존할 수 있으며 같은 폴더 안에서는 상대 경로를 쓸 수 있다. | 상세의 `page.tsx` → `@/common/data/cases`; `cases.ts` → `./tab-timing` |

홈과 상세는 서로의 `_components/`나 `_content/`를 가져오지 않는다. 예를 들어 홈에서 상세의 `scada-example`을 직접 가져오는 것은 금지한다. 두 라우트에 실제로 필요한 부분만 공용 모듈로 추출하고, 어느 쪽 화면에도 의존하지 않게 한다.

## 파일명과 예외

- 일반 소스 폴더와 직접 만드는 React 파일은 소문자 kebab-case로 쓴다. 한 단어는 `icons/`, `button.tsx`처럼, 여러 단어는 `home-screen.tsx`처럼 표기한다. 컴포넌트 이름은 `HomeScreen`처럼 PascalCase로 쓴다. 이 방식은 라우트 전용 파일과 shadcn UI 파일에서 이미 같으므로 PascalCase 파일명으로 바꾸지 않는다.
- 컴포넌트는 이름 있는 export를 사용한다. 관련 부품은 같은 파일에서 함께 공개할 수 있다. 예: `table.tsx`의 `Table`, `TableRow`, `TableCell`.
- Next.js가 읽는 `page.tsx`, `layout.tsx`, `route.ts`와 동적 세그먼트 `[slug]`는 용도에 맞는 이름을 그대로 쓴다. 페이지·레이아웃의 기본 export와 `route.ts`의 HTTP 메서드 export도 일반 컴포넌트 규칙의 대상이 아니다. `_components`, `_content`의 밑줄은 라우트 전용 폴더임을 나타낸다.

## 폴더 공개 진입점과 직접 import

현재 공용 UI의 공개 진입점은 `ui/` 폴더 전체가 아니라 **각 부품 파일의 이름 있는 export**다. 예를 들어 `import { Button } from "@/common/components/ui/button"`은 허용하지만 `from "@/common/components/ui"`는 쓰지 않는다. 사용처에서 어느 파일이 부품을 제공하는지 보이고, 부품을 추가할 때 별도 재수출 목록도 고칠 필요가 없다.

- 라우트에서는 **같은 라우트 안의 전용 파일** 또는 **공개한 공용 모듈 파일**에서 직접 가져온다. 다른 라우트의 전용 파일은 상대 경로, 별칭, 재수출 중 무엇을 써도 공개 API가 아니다.
- 이후 공용 기능의 구현이 여러 파일로 나뉘고 여러 사용처에 고정된 API를 제공해야 한다면, 해당 폴더에 한해 `index.ts`를 제안할 수 있다. 도입하는 PR에서 공개할 이름을 명시적으로 재수출하고 사용처와 문서를 함께 갱신한다. 그때부터 폴더 밖에서는 그 진입점만 쓰고 내부 파일을 직접 가져오지 않는다.

## 자동 검사와 PR 리뷰의 경계

| 구분 | 확인 항목 |
| --- | --- |
| 자동 · `pnpm lint` | [ESLint 설정](../../eslint.config.mjs)의 `no-restricted-imports`가 `src/common/`에서 `@/app/…` 또는 상대 경로로 `app/…`를 참조하는 정적 import·재수출을 막는다. |
| 자동 · `pnpm test`의 [구조 검사](../../tests/structure.test.mjs) | `src/app`이 있고 `app`, `pages`, `src/pages`가 없는지 확인한다. 공용 모듈의 재수출 예제로 허용 경로 하나와 금지 경로 두 개가 ESLint에서 기대대로 판정되는지도 확인한다. |
| PR 리뷰 | 파일명·컴포넌트 이름, 라우트 간 전용 모듈 참조 금지, 화면과 공용 UI의 책임 분리, 폴더 진입점과 직접 import의 예외를 확인한다. 현재 구조 검사가 이 항목들까지 강제하지는 않는다. |
