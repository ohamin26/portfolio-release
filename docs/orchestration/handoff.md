# 새 clone에서 이슈 작업 준비하기

앱만 실행할 때는 [로컬 실행과 검증](../setup/initial-setup.md)만 따르면 된다. 이 안내는 에이전트가 이슈별 브랜치·worktree에서 작업하고 GitHub Project로 인계할 때 사용한다.

## 무엇을 준비하는가

| 공개 저장소에 있는 것 | 별도로 준비할 것 |
| --- | --- |
| [설정 예시](config-example.yml), [작업 프롬프트 예시](agent-task-example.md), [읽기 전용 점검](../../scripts/check-orchestration) | 팀이 승인한 공유 실행기 **전체 배포본**(`worktree-orchestrator` 0.1.0 호환, `bin/orchestrator`와 `orchestration/` 포함). 공개 패키지 설치나 경로 자동 탐색을 전제하지 않는다. 배포 출처·버전은 전달자에게 확인한다. |
| Node 버전, pnpm 잠금 파일, [에이전트 규칙](../../AGENTS.md) | Bash, Ruby와 표준 라이브러리, Git, tmux, GitHub CLI. 앱 설치·검증은 Node 22.13 이상 22.x와 pnpm 11.1.2를 사용한다. 자동으로 에이전트까지 시작할 때만 OpenCode와 해당 계정 인증이 필요하다. |

GitHub 저장소 및 Project 쓰기 권한은 로컬 실행기 설치와 별개다. 실제 작업을 시작할 계정으로 `gh auth status`와 Project 접근 여부를 확인한다. 토큰, 개인 설정, 원본 작업 프롬프트·로그는 복사하거나 커밋하지 않는다. 기존 설치의 `scripts/orchestrate` 래퍼나 개인 PRD·체크리스트는 필수가 아니다.

## 최초 설정 (로컬 파일 생성)

깨끗한 clone의 루트에서 실행한다. 두 예시의 목적지는 Git에서 제외된다. 다른 설치의 설정이 이미 있으면 덮어쓰지 말고 비교한다.

```sh
mkdir -p prompts/templates worktrees logs
test -e orchestration.config.yml || cp docs/orchestration/config-example.yml orchestration.config.yml
test -e prompts/templates/agent-task.md || cp docs/orchestration/agent-task-example.md prompts/templates/agent-task.md
```

`workspace.root: .`은 **설정 파일의 위치**를, `repos.portfolio.path: .`은 그 작업공간 안의 저장소를 뜻한다. 설정을 예시 디렉터리에 둔 채 실행하지 않는다. 아래는 실행기를 clone과 나란히 설치한 예다. 다른 곳에 설치했다면 첫 줄을 신뢰하는 실행 파일의 절대 경로로 바꾼다.

```sh
export ORCHESTRATOR_BIN="$(pwd -P)/../orchestrator/bin/orchestrator"
export ORCHESTRATION_CONFIG="$(pwd -P)/orchestration.config.yml"
```

설치와 검증은 실행기가 새 로그인 셸(`bash -lc`)에서 수행한다. 현재 터미널뿐 아니라 `bash -lc 'node --version && pnpm --version'`도 프로젝트 버전을 가리키게 준비한다. GitHub 및 에이전트 자격 증명은 로컬 인증 저장소를 사용하고 YAML에 넣지 않는다.

## 준비 상태 확인 (쓰기 없음)

```sh
scripts/check-orchestration
```

- **준비됨(종료 0)**: 작업 프롬프트와 필수 도구를 찾았고, 공유 실행기의 `status`가 설정을 읽어 **현재 clone**을 `portfolio`로 인식했다. 새 clone에서는 작업 세션이 없어도 정상이다.
- **준비 안 됨(0 이외)**: 안내된 실행기·설정·템플릿·도구 또는 작업공간 경로를 고친 뒤 같은 명령을 다시 실행한다. 이 점검은 설치 명령 실행, 에이전트 로그인, 원격 쓰기 권한, Vercel 동작까지 확인하지 않는다.
- 세부 정보가 필요할 때만 `"$ORCHESTRATOR_BIN" status`를 로컬에서 본다. 상태 출력에는 로컬 경로와 세션 식별자가 포함될 수 있다. `validate-session --dry-run`도 결과 파일을 쓰므로 준비 점검으로 대체하지 않는다. 점검을 위해 작업 세션·시험용 PR·배포를 만들지 않는다.

## 실제 이슈를 맡았을 때

1. **Todo → In Progress:** 저장소의 이슈 번호·작업코드·완료 조건·의존성을 확인하고 Project 항목의 상태를 바꾼다. 칸반과 표는 같은 항목을 사용한다.
2. **브랜치·worktree:** 최신 `main`을 확인한 뒤 clone 루트에서 아래 명령을 쓴다. `TASK`에는 영문 소문자·숫자·하이픈으로 된 고유한 작업명을 넣는다. 세션 시작은 브랜치와 worktree를 만들고 의존성을 설치한다. 준비 확인용 명령이 아니다.
   ```sh
   TASK=issue-123-example  # 실제 이슈 번호와 영문 작업명으로 바꾼다
   "$ORCHESTRATOR_BIN" orchestrate portfolio "$TASK" main --no-attach --no-inject --request '이슈 범위와 완료 조건'
   ```
   앱 변경은 `worktrees/portfolio/$TASK/`의 `worktree/$TASK` 브랜치에서만 한다. 요청·세션 로그는 로컬에 남는다. 이 명령 자체가 에이전트를 시작하거나 커밋·PR·Project 갱신을 수행하지 않는다.
3. **검증:** 앱의 [최초 설치 절차](../setup/initial-setup.md)에 따라 브라우저를 준비한다. clone 루트에서 `"$ORCHESTRATOR_BIN" validate-session portfolio "$TASK"`를 실행한다. 검증 순서는 lint → typecheck → build → test이고, 실패 시 해당 단계부터 바로잡는다.
4. **PR → In Review:** 에이전트가 **인증된 Git/GitHub CLI**로 해당 브랜치를 푸시하고 실제 변경을 전달하는 PR을 하나 연다. 한국어 커밋·PR 제목과 작업코드, `Closes #번호`, 검증 결과를 남긴 후 Project를 In Review로 옮긴다. 비공개 경로·로그·접근 정보는 게시하지 않는다.
5. **병합 → Done:** PR 검사와 이슈별 조건이 충족되면 승인 범위 안에서 병합한다. 이슈 종료를 확인한 뒤 Project를 Done으로 옮긴다. 차단된 이슈는 열린 상태로 둔다. Preview 개발 검증·프로덕션 배포·사용자 검증은 서로 대신하지 않는다.
