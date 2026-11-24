# portfolio-release

프론트엔드 개발자 오하민의 개인 포트폴리오다. `/`에서 프로필, 대표 작업 세 편, AI 에이전트와 일하는 방식, 연락처를 확인할 수 있다. 서버 상태 확인 경로는 `/health`다.

- [소스 구조와 경로](docs/architecture/project-structure.md)
- [로컬 실행과 검증](docs/setup/initial-setup.md)
- [페이지 기획 기준](docs/features/page-plan.md) · [디자인 기준](docs/design/design-guide.md)
- [에이전트 작업 규칙](AGENTS.md) · [작업 이슈](https://github.com/ohamin26/portfolio-release/issues)

라우트는 `src/app/`, 공유 코드는 `src/common/`에서 관리한다. 홈의 대표 작업 제목을 누르면 `/work/[slug]`의 사례 소개로 이동한다. 각 상세 주소로 직접 접속하거나 읽은 뒤 `/#work`로 돌아갈 수 있다.
