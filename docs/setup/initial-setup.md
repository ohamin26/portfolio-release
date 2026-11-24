# 로컬 실행과 검증

Node.js 22(22.13 이상)와 pnpm 11.1.2를 사용한다. 저장소 루트에서 실행한다.

```sh
nvm install     # .nvmrc 기준 (이미 설치했다면 nvm use)
npm install --global pnpm@11.1.2
pnpm install --frozen-lockfile
pnpm dev
```

확인 경로는 http://localhost:3000/health 이며, 정상 응답은 HTTP 200과 JSON `{"status":"ok"}`이다. 홈 화면, API 키, 환경 변수 파일은 필요하지 않다.

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

Playwright가 프로덕션 빌드를 루프백 주소에서 시작하여 HTTP 응답을 검사한다. 이 단계는 브라우저를 띄우지 않으므로 브라우저 바이너리 설치가 필요 없다. 기본 포트 4177이 사용 중이면 `PORTFOLIO_TEST_PORT=4187 pnpm test`로 실행한다. PR 검사도 같은 순서로 실행하며 배포하지 않는다.

ESLint는 JavaScript 기본 규칙, TypeScript 권장 규칙, Next.js의 Core Web Vitals 규칙을 사용한다.
