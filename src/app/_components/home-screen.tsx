import { ProfileSection } from "./profile-section";
import { WorkSection } from "./work-section";
import { LinkedInLink } from "./linkedin-link";
import s from "./home.module.css";

export function HomeScreen() {
  return (
    <div className={s.home}>
      <a className={s.skip} href="#main-content">본문 바로가기</a>
      <header className={s.header}>
        <a className={s.brand} href="#profile">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect width="28" height="28" rx="6" fill="currentColor" />
            <path d="M5 16l6-7h2v6l-6 7H5zm10-3 6-7h2v7l-6 7h-2z" fill="white" />
          </svg>
          오하민
        </a>
        <nav aria-label="주요 탐색">
          <a href="#work">대표 작업</a><a href="#method">일하는 방식</a><a href="#contact">연락</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <ProfileSection />
        <WorkSection />
        <section className={s.method} id="method" tabIndex={-1} aria-labelledby="method-title">
          <div>
            <span className={s.micro} lang="en">METHOD NOTE / 01</span>
            <h2 id="method-title">AI 에이전트와 일하는 방식</h2>
          </div>
          <p>먼저 목표와 바꿀 범위를 문서에 적고, 반복해서 살펴볼 기준은 체크리스트로 남깁니다.
            독립적인 작업은 에이전트에게 나눠 맡깁니다. 결과를 합칠 때는 변경이 필요한 범위에 그쳤는지,
            테스트가 원래 문제를 잡아내는지 직접 확인합니다.</p>
        </section>
      </main>
      <footer className={s.footer} id="contact" tabIndex={-1} aria-labelledby="contact-title">
        <span className={s.micro} lang="en">CONTACT</span>
        <h2 id="contact-title">연락하기</h2>
        <LinkedInLink>LinkedIn에서 연락하기</LinkedInLink>
        <div className={s.colophon} aria-hidden="true"><span>OH HAMIN</span><span>PORTFOLIO  /  2026</span></div>
      </footer>
    </div>
  );
}
