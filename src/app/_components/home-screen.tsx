import { WorkLink } from "./work-link";
import { SkipLink } from "@/common/components/ui/skip-link";
import { PortfolioMark } from "@/common/components/ui/icons/portfolio-mark";
import { ProfileSection } from "./profile-section";
import { WorkSection } from "./work-section";
import { LinkedInLink } from "./linkedin-link";
import { bodyCopy, folioLabel, microLabel, sectionTitle } from "./home-typography";

const navLink = "flex min-h-11 min-w-11 items-center justify-center text-[.875rem] font-[550] hover:underline hover:underline-offset-[.2em] home-narrow:text-[.8rem]";

export function HomeScreen() {
  return (
    <div className="mx-auto w-[min(1264px,88%)] font-sans break-keep wrap-anywhere text-foreground home-stack:w-[calc(100%-48px)] [@media(max-width:359px)]:w-[calc(100%-32px)] [&_:where(a,[tabindex]):focus-visible]:outline-2 [&_:where(a,[tabindex]):focus-visible]:outline-offset-4 [&_:where(a,[tabindex]):focus-visible]:outline-ring">
      <SkipLink />
      <header className="flex items-center justify-between gap-3 border-b border-border py-[clamp(12px,2vw,28px)] home-narrow:flex-wrap home-narrow:gap-x-1.5 home-narrow:gap-y-0">
        <a className="flex min-h-11 items-center gap-2 text-[1.32rem] font-[740] tracking-[-.055em] home-narrow:text-[1.08rem]" href="#profile">
          <PortfolioMark className="text-ring home-narrow:size-[25px]" />
          오하민
        </a>
        <nav className="flex flex-wrap items-center gap-[clamp(6px,2vw,30px)] home-narrow:gap-[5px]" aria-label="주요 탐색">
          <WorkLink className={navLink}>대표 작업</WorkLink>
          <a className={navLink} href="#method">일하는 방식</a>
          <a className={navLink} href="#contact">연락</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <ProfileSection />
        <WorkSection />
        <section className="my-[clamp(52px,6vw,88px)] grid scroll-mt-6 grid-cols-[minmax(0,29%)_minmax(0,1fr)] items-center gap-[22px] rounded-[5px] bg-muted p-[26px] home-stack:my-[46px] home-stack:grid-cols-1 home-stack:gap-3 home-stack:p-5" id="method" tabIndex={-1} aria-labelledby="method-title">
          <div>
            <span className={microLabel} lang="en">METHOD NOTE / 01</span>
            <h2 className={`mt-1.5 ${sectionTitle}`} id="method-title">AI 에이전트와 일하는 방식</h2>
          </div>
          <p className={bodyCopy}>먼저 목표와 바꿀 범위를 문서에 적고, 반복해서 살펴볼 기준은 체크리스트로 남깁니다.
            독립적인 작업은 에이전트에게 나눠 맡깁니다. 결과를 합칠 때는 변경이 필요한 범위에 그쳤는지,
            테스트가 원래 문제를 잡아내는지 직접 확인합니다.</p>
        </section>
      </main>
      <footer className="scroll-mt-6 border-t border-border pt-[clamp(28px,3vw,46px)]" id="contact" tabIndex={-1} aria-labelledby="contact-title">
        <span className={microLabel} lang="en">CONTACT</span>
        <h2 className="my-[7px] text-[clamp(1.75rem,2.75vw,2.55rem)] font-bold tracking-[-.05em]" id="contact-title">연락하기</h2>
        <LinkedInLink>LinkedIn에서 연락하기</LinkedInLink>
        <div className={`${folioLabel} mt-8 flex items-center justify-between border-t border-border py-[25px] text-muted-foreground`} aria-hidden="true"><span>OH HAMIN</span><span>PORTFOLIO  /  2026</span></div>
      </footer>
    </div>
  );
}
