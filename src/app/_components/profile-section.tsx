import { WorkLink } from "./work-link";
import { Button } from "@/common/components/ui/button";
import { NavigationArrow } from "@/common/components/ui/icons/navigation-arrow";
import { LinkedInLink } from "./linkedin-link";
import { SystemStudy } from "./system-study";
import { bodyCopy, eyebrow } from "./home-typography";

export function ProfileSection() {
  return (
    <section className="grid scroll-mt-6 grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] items-center gap-[clamp(2rem,5vw,5rem)] pt-[clamp(68px,8vw,112px)] pb-[clamp(60px,6vw,92px)] home-stack:grid-cols-1 home-stack:pt-[54px] home-stack:pb-[42px]" id="profile" tabIndex={-1} aria-labelledby="profile-title">
      <div>
        <p className={eyebrow} lang="en">PROFILE  /  OH HAMIN</p>
        <h1 className="mt-[.55em] mb-[.42em] text-[clamp(44px,5.15vw,72px)] font-[750] leading-[1.16] tracking-[-.065em] home-stack:text-[clamp(36px,7vw,52px)]" id="profile-title">프론트엔드 개발자 <span className="block">오하민입니다.</span></h1>
        <p className={`${bodyCopy} max-w-[650px] text-[clamp(1rem,1.4vw,1.2rem)]`}>
          누구에게나 망설임 없이 보여줄 수 있는 서비스를 만듭니다.
          <br />
          단순히 동작하는 것에 만족하지 않고, 더 나은 방법을 고민합니다.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button asChild>
            <WorkLink>대표 작업 보기 <NavigationArrow direction="right" /></WorkLink>
          </Button>
          <LinkedInLink>LinkedIn</LinkedInLink>
        </div>
      </div>
      <SystemStudy />
    </section>
  );
}
