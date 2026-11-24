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
pnpm exec playwright install --only-shell chromium  # 최초 1회 (Linux CI에서는 --with-deps 추가)
pnpm test
```

`pnpm test`는 먼저 라우트 위치와 공용 모듈의 의존 방향을 검사한다. 이어서 Playwright가 프로덕션 빌드를 루프백 주소에서 시작하여 HTTP 응답을 검사한다. 사례 조회와 그래프 계산을 확인하고, 공용 버튼은 Chromium에서 모바일 너비·키보드 포커스·모션 감소 설정으로 검증한다. 별도의 시연용 라우트는 만들지 않는다. 기본 포트 4177이 사용 중이면 `PORTFOLIO_TEST_PORT=4187 pnpm test`로 실행한다. PR 검사도 같은 순서로 실행하며 배포하지 않는다.

ESLint는 JavaScript 기본 규칙, TypeScript 권장 규칙, Next.js의 Core Web Vitals 규칙을 사용한다.
