import s from "./home.module.css";

export function LinkedInLink({ children }: { children: string }) {
  return (
    <a href="https://www.linkedin.com/in/ohamin/" className={s.linkedin}>
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
