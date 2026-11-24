import { buttonVariants } from "@/common/components/ui/button";
import { LinkedInLink } from "./linkedin-link";
import { SystemStudy } from "./system-study";
import s from "./home.module.css";

export function ProfileSection() {
  return (
    <section className={s.hero} id="profile" tabIndex={-1} aria-labelledby="profile-title">
      <div>
        <p className={s.eyebrow} lang="en">PROFILE  /  OH HAMIN</p>
        <h1 id="profile-title">프론트엔드 개발자 <span>오하민입니다.</span></h1>
        <p className={s.intro}>
          제조 현장의 터치 화면부터 자동차 정비 서비스의 결제 화면까지 만들어 왔습니다.
          같은 업무라도 누가, 어디서 쓰느냐에 따라 화면이 어떻게 달라져야 하는지 고민합니다.
        </p>
        <div className={s.actions}>
          <a className={buttonVariants()} href="#work">대표 작업 보기 <span aria-hidden="true">→</span></a>
          <LinkedInLink>LinkedIn</LinkedInLink>
        </div>
      </div>
      <SystemStudy />
    </section>
  );
}
