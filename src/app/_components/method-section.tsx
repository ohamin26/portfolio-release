import { Button } from "@/common/components/ui/button";
import { NavigationArrow } from "@/common/components/ui/icons/navigation-arrow";
import { bodyCopy, microLabel, sectionTitle } from "./home-typography";

export function MethodSection() {
  return (
    <section className="my-[clamp(52px,6vw,88px)] grid scroll-mt-6 grid-cols-[minmax(0,29%)_minmax(0,1fr)] items-start gap-[22px] rounded-[5px] bg-muted p-[26px] home-stack:my-[46px] home-stack:grid-cols-1 home-stack:gap-3 home-stack:p-5" id="method" tabIndex={-1} aria-labelledby="method-title">
      <div>
        <span className={microLabel} lang="en">METHOD NOTE / 01</span>
        <h2 className={`mt-1.5 ${sectionTitle}`} id="method-title">AI 에이전트와 일하는 방식</h2>
      </div>
      <div className="min-w-0 max-w-prose space-y-4">
        <p className={bodyCopy}>
          에이전트에게 일을 맡기기 전에, 무엇을 바꾸고 어떤 동작은 그대로 지켜야 하는지 문서에 적습니다.
          방향이 분명하지 않을 때는 코드부터 바꾸지 않고 가능한 방법과 그 근거를 먼저 살핍니다.
          방향을 정한 뒤에는 서로 영향을 주지 않는 작업만 나눠, 각 에이전트가 맡은 범위 안에서 구현과 검증까지 진행하도록 합니다.
        </p>
        <p className={bodyCopy}>
          결과를 합칠 때 제가 먼저 묻는 건 “같은 문제가 다시 생기면 이 테스트가 잡아낼 수 있을까?”입니다.
          성능을 볼 때도 마찬가지입니다. 탭 전환을 개선했을 때는 탭이 표시됐음을 감지한 시점과 화면이 다 그려진 시점을 구분해서 수치를 해석했습니다.
          무엇을 반영할지는 이런 근거를 보고 직접 결정하고, 반복해서 쓰는 리뷰 기준은 다음 작업을 위한 체크리스트로 남깁니다.
        </p>
        <Button asChild variant="link" className="max-w-full justify-start px-0 text-left">
          <a href="https://github.com/ohamin26/portfolio-release">
            <span className="min-w-0">이 포트폴리오의 GitHub 저장소 보기</span>
            <NavigationArrow direction="up-right" />
          </a>
        </Button>
      </div>
    </section>
  );
}
