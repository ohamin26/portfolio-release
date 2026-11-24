# 포트폴리오 에이전트 가이드

- 저장소 이슈 하나에 작업 범위와 완료 조건을 기록한다. 독립 작업은 별도의 브랜치와 Git worktree에서 진행한다. 작업 시작 시 Todo → In Progress, 검증 및 PR 생성 후 In Review, 병합 후에만 Done으로 옮긴다.
- 현재 기준선에는 `src/app/health/route.ts`만 있다. 후속 화면은 `src/app/`의 얇은 진입점과 해당 라우트의 `_components/`로 나눈다. 여러 화면이 실제로 공유하는 UI만 `src/common/components/ui/`에 둔다. 화면끼리 상대 라우트의 private 폴더를 import하지 않는다.
- 현행 환경·명령은 [설치 가이드](docs/setup/initial-setup.md)와 [package.json](package.json)을 따른다. 새 문서는 주제별 `docs/` 아래 소문자 kebab-case로 두고 [목차](readme.md)에 연결한다. 확인한 사실과 목표 사항을 구분한다.
- Node.js 22에서 lint → typecheck → build → test를 검증한다. 실패하거나 검증하지 못한 항목은 그대로 보고한다. PR에는 이슈 번호, 변경 범위, 검증 근거와 제외 사항을 적는다.
- 로컬에 있던 초안은 참고 자료다. 원본 경력 문서·사내 캡처·개인 경로·인증정보·세션 로그를 공개 저장소로 복사하지 않는다. 검증 통과가 병합이나 배포 승인을 뜻하지 않는다.

## 커밋과 PR

커밋 제목과 본문, PR 제목과 설명은 한국어로 작성한다. 제목에는 변경 대상을 적는다(예: `프로젝트 기준선과 검증 환경 구성`). PR은 [공통 템플릿](.github/pull_request_template.md)에 따라 작성하고, 이슈 자동 연결 키워드(`Closes #번호`)와 코드·명령어 이름은 원문을 유지한다.
