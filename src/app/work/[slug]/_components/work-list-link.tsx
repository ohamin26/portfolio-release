"use client";

import Link from "next/link";
import { Button } from "@/common/components/ui/button";
import { NavigationArrow } from "@/common/components/ui/icons/navigation-arrow";
import type { PortfolioCase } from "@/common/data/cases";
import { requestWorkCard } from "@/common/lib/work-card-return";

export function WorkListLink({ slug }: { slug: PortfolioCase["slug"] }) {
  return (
    <Button asChild variant="outline" className="focus-visible:outline-offset-4">
      <Link href="/#work" scroll={false} onNavigate={() => requestWorkCard(slug)}>
        <NavigationArrow direction="left" /> 대표 작업 목록으로
      </Link>
    </Button>
  );
}
