import Link from "next/link";
import { Button } from "@/common/components/ui/button";
import { NavigationArrow } from "@/common/components/ui/icons/navigation-arrow";
import type { PortfolioCase } from "@/common/data/cases";
import { WorkListLink } from "./work-list-link";

type Props = {
  slug: PortfolioCase["slug"];
  nextCase: PortfolioCase | undefined;
};

export function CaseNavigation({ slug, nextCase }: Props) {
  return (
    <nav aria-label="사례 탐색" className="flex items-center justify-between gap-5 border-t border-border pt-6 pb-12 case-narrow:flex-col case-narrow:items-start">
      <WorkListLink slug={slug} />
      {nextCase && (
        <Button asChild variant="link" className="group min-w-0 max-w-full shrink justify-between gap-4 px-2 py-2 text-left hover:no-underline focus-visible:outline-offset-4 case-narrow:w-full case-narrow:px-0">
          <Link href={`/work/${nextCase.slug}`} rel="next">
            <span className="grid min-w-0 gap-1">
              <span className="text-sm text-muted-foreground">다음 작업</span>
              <span className="text-base leading-relaxed text-foreground underline-offset-4 group-hover:underline">{nextCase.title}</span>
            </span>
            <NavigationArrow direction="right" />
          </Link>
        </Button>
      )}
    </nav>
  );
}
