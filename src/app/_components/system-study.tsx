import { SystemStudyIllustration } from "@/common/components/ui/icons/system-study-illustration";
import { folioLabel, microLabel } from "./home-typography";

export function SystemStudy() {
  return (
    <figure className="rounded-[5px] bg-muted p-[clamp(18px,2vw,26px)] home-stack:hidden" aria-hidden="true">
      <div className={`${microLabel} flex items-center justify-between`}><span>FIG. 01</span><span className="text-muted-foreground">SYSTEM STUDY</span></div>
      <SystemStudyIllustration className="my-[clamp(20px,2vw,32px)] block w-full" />
      <figcaption className="flex items-center justify-between gap-3 text-[.95rem]"><strong className="font-[680]">하나의 규칙, 여러 화면</strong><span className={`${folioLabel} text-muted-foreground`}>01 / 03</span></figcaption>
    </figure>
  );
}
