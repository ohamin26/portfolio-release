import { createHash } from "node:crypto";
import type { Metadata } from "next";
import type { PortfolioCase } from "@/common/data/cases";

const site = new URL("https://portfolio-release-eight.vercel.app");
const siteName = "오하민 포트폴리오";

export const homeCard = { key: "home", label: "프로필", title: "오하민 · 프론트엔드 개발자" };
type ShareCard = typeof homeCard;

export function caseCard({ slug, field, title }: PortfolioCase): ShareCard {
  return { key: slug, label: field, title };
}

export function shareImagePath({ key, label, title }: ShareCard) {
  // 문구가 바뀌면 새 URL을 사용한다. 이미지를 다시 내보내지 않으면 링크 검사가 실패한다.
  const revision = createHash("sha256").update(JSON.stringify([label, title])).digest("hex").slice(0, 12);
  return `/share/${key}-${revision}.png`;
}

export function shareMetadata(card: ShareCard, description: string): Metadata {
  const isHome = card.key === "home";
  const path = isHome ? "/" : `/work/${card.key}`;
  const url = new URL(path, site).href;
  const image = {
    url: new URL(shareImagePath(card), site).href,
    width: 1200, height: 630, type: "image/png",
    alt: `${siteName} · ${card.label}: ${card.title}`,
  };

  return {
    title: isHome ? card.title : `${card.title} | ${siteName}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: isHome ? "website" : "article", locale: "ko_KR", siteName,
      url, title: card.title, description, images: [image],
    },
    twitter: { card: "summary_large_image", title: card.title, description, images: [image] },
  };
}
