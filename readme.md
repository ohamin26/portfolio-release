# portfolio-release

개인 포트폴리오의 개발 기준선이다. 사용자가 접근할 수 있는 경로는 `GET /health`뿐이다. 홈·사례 화면이 사용할 공용 버튼과 정적 사례 데이터는 준비되어 있다.

- [소스 구조와 경로](docs/architecture/project-structure.md)
- [로컬 실행과 검증](docs/setup/initial-setup.md)
- [페이지 기획 기준](docs/features/page-plan.md) · [디자인 기준](docs/design/design-guide.md)
- [에이전트 작업 규칙](AGENTS.md) · [작업 이슈](https://github.com/ohamin26/portfolio-release/issues)

라우트는 `src/app/`, 공유 코드는 `src/common/`에서 관리한다. 홈·사례 화면은 후속 이슈에서 구현한다.
