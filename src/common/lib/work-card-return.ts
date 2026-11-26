import { findCaseBySlug, type PortfolioCase } from "@/common/data/cases";

type Slug = PortfolioCase["slug"];
let requestedCard: Slug | null = null;

// 명시적 목록 링크는 새 홈 방문이다. 이 이동에만 상세의 slug를 전달한다.
export function requestWorkCard(slug: Slug) {
  requestedCard = slug;
}

// 뒤로가기는 상세를 열었던 홈의 이력 항목으로 돌아온다. 탭 전체의 기본값은 바꾸지 않는다.
export function rememberWorkCard(slug: Slug) {
  window.history.replaceState({ ...window.history.state, portfolioWorkCard: slug }, "");
}

export function readReturningCard(): Slug | null {
  const requested = requestedCard;
  requestedCard = null;
  if (requested && window.location.hash === "#work") {
    rememberWorkCard(requested);
    return requested;
  }
  const saved = window.history.state?.portfolioWorkCard;
  return typeof saved === "string" ? findCaseBySlug(saved)?.slug ?? null : null;
}
