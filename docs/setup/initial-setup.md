# 로컬 실행과 검증

Node.js 22(22.13 이상)와 pnpm 11.1.2를 사용한다. 저장소 루트에서 실행한다.

```sh
nvm install     # .nvmrc 기준 (이미 설치했다면 nvm use)
npm install --global pnpm@11.1.2
pnpm install --frozen-lockfile
pnpm dev
```

http://localhost:3000 에서 홈을 확인한다. `/health`는 HTTP 200과 JSON `{"status":"ok"}`을 반환한다. 두 경로 모두 API 키나 환경 변수 파일이 필요하지 않다.

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright install --only-shell chromium firefox webkit  # 최초 1회 (Linux CI에서는 --with-deps 추가)
pnpm test
```

`pnpm test`는 먼저 라우트 위치와 공용 모듈의 의존 방향을 검사한다. 이어서 Playwright가 프로덕션 빌드를 루프백 주소에서 시작하여 HTTP 응답을 검사한다. 사례 조회와 그래프 계산을 확인하고, 공용 버튼은 Chromium에서 모바일 너비·키보드 포커스·모션 감소 설정으로 검증한다. 별도의 시연용 라우트는 만들지 않는다. 기본 포트 4177이 사용 중이면 `PORTFOLIO_TEST_PORT=4187 pnpm test`로 실행한다. PR 검사도 같은 순서로 실행하며 배포하지 않는다.

Chromium은 전체 스위트를 실행하고, Firefox와 WebKit은 `@cross-browser`로 표시한 키보드 탐색·SCADA 연동 검사를 실행한다. 빌드 후 특정 엔진만 다시 확인하려면 예를 들어 `pnpm exec playwright test --project=webkit`을 쓴다. Playwright WebKit 결과는 실제 iOS Safari 기기 검증이 아니다.

ESLint는 JavaScript 기본 규칙, TypeScript 권장 규칙, Next.js의 Core Web Vitals 규칙을 사용한다.

## 링크 공유 이미지 갱신

홈과 사례 상세의 Open Graph·소셜 카드에는 같은 페이지의 공개 제목과 설명을 쓴다. 주소는 요청 호스트가 아닌 [운영 사이트](https://portfolio-release-eight.vercel.app/)를 기준으로 만든다. 운영 도메인을 바꾸면 [공유 메타데이터](../../src/common/lib/share-metadata.ts)의 주소와 관련 테스트를 함께 갱신한다.

이미지는 빌드 때 외부 글꼴을 내려받지 않도록 완성된 PNG를 배포한다. 제목·분야·마크·[카드 서식](../../scripts/share-card.html)을 바꾼 경우 한글 시스템 글꼴과 Playwright Chromium이 설치된 환경에서 `pnpm share:images`를 실행한다. `public/share/`의 결과를 열어 한글 줄바꿈과 여백을 확인하고 커밋한다. 제목이나 분야가 바뀌면 파일명도 바뀌므로, 기존 공유 링크를 유지하려면 이전 파일을 지우지 않는다.
