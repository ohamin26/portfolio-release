# 포트폴리오 에이전트 가이드

- 저장소 이슈 하나에 작업 범위와 완료 조건을 기록한다. 독립 작업은 별도의 브랜치와 Git worktree에서 진행한다. 작업 시작 시 Todo → In Progress, 검증 및 PR 생성 후 In Review, 병합 후에만 Done으로 옮긴다.
- [소스 구조와 경로](docs/architecture/project-structure.md)와 [폴더·파일명·모듈 진입점](docs/architecture/module-conventions.md)을 따른다. 화면 전용 조합은 해당 라우트에 두고 공용 UI와 분리한다. 다른 라우트의 전용 폴더는 import하지 않는다.
- 현행 환경·명령은 [설치 가이드](docs/setup/initial-setup.md)와 [package.json](package.json)을 따른다. 새 문서는 주제별 `docs/` 아래 소문자 kebab-case로 두고 [목차](readme.md)에 연결한다. 확인한 사실과 목표 사항을 구분한다.
- Node.js 22에서 lint → typecheck → build → test를 검증한다. 실패하거나 검증하지 못한 항목은 그대로 보고한다. PR에는 이슈 번호, 변경 범위, 검증 근거와 제외 사항을 적는다.
- 로컬에 있던 초안은 참고 자료다. 원본 경력 문서·사내 캡처·개인 경로·인증정보·세션 로그를 공개 저장소로 복사하지 않는다. 검증 통과가 병합이나 배포 승인을 뜻하지 않는다.

## 커밋과 PR

커밋과 PR은 제목과 본문을 한국어로 작성한다. PR 제목은 `유형: [작업코드] 한국어 요약` 형식으로 쓴다. 유형은 변경의 주된 목적을, 작업코드는 연결 이슈 제목의 식별자(예: `P01`)를 나타낸다.

- 유형: `feat` 기능, `fix` 버그 수정, `refactor` 동작 변경 없는 구조 개선, `docs` 문서, `test` 테스트, `ci` 자동 검증·배포 설정, `chore` 개발 환경·기타 유지보수.
- 예: `chore: [P01] 프로젝트 개발 기준선과 한국어 PR 템플릿 구성`

PR 본문은 [공통 템플릿](.github/pull_request_template.md)을 따른다. 작업코드와 별개로 이슈를 연결하는 `Closes #번호`를 남기고, 코드·명령어 이름은 원문을 유지한다.
