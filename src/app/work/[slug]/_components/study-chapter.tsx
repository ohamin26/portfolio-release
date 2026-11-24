import type { ReactNode } from "react";
import { studyLabel } from "./study-styles";

type Props = { id: string; label: string; title: string; children: ReactNode };

export function StudyChapter({ id, label, title, children }: Props) {
  return (
    <section aria-labelledby={id} className="mt-[clamp(32px,5vw,64px)] border-t border-border pt-[clamp(28px,4vw,56px)]">
      <p className={studyLabel} lang="en">{label}</p>
      <h2 id={id} className="mt-2 mb-4 text-[clamp(1.65rem,3.2vw,2.8rem)] leading-[1.32] font-[710] tracking-[-.055em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
