import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";
import { introductions } from "@/app/work/[slug]/_content/introductions";

const production = "https://portfolio-release-eight.vercel.app";
const pages = [
  { path: "/", title: "오하민 · 프론트엔드 개발자", description: "제조 현장의 터치 화면부터 자동차 정비 서비스의 결제 경험까지, 오하민의 프론트엔드 작업을 소개합니다." },
  ...cases.map(({ slug, title }) => ({ path: `/work/${slug}`, title, description: introductions[slug].summary })),
];

test("공유 크롤러는 원문 HTML에서 페이지마다 다른 운영 주소와 PNG 카드를 읽는다", async ({ page, request }) => {
  const imageUrls = new Set<string>();
  const imageDigests = new Set<string>();
  for (const { path, title, description } of pages) {
    const response = await request.get(path + "?ref=metadata-test", { headers: { "user-agent": "Twitterbot/1.0" } });
    expect(response.status()).toBe(200);
    // 크롤러가 받는 원문만 파싱한다. 스크립트 실행이나 hydration에 의존하지 않는다.
    const tags = await page.evaluate((html) => {
      const { head } = new DOMParser().parseFromString(html, "text/html");
      return Object.fromEntries(
        ["og:title", "og:description", "og:url", "og:image", "og:image:alt", "og:image:width", "og:image:height",
          "twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt", "canonical"]
          .map((key) => {
            const nodes = key === "canonical" ? head.querySelectorAll('link[rel="canonical"]')
              : head.querySelectorAll(`meta[${key.startsWith("og:") ? "property" : "name"}="${key}"]`);
            return [key, [...nodes].map((el) => el.getAttribute(key === "canonical" ? "href" : "content") ?? "")];
          }),
      );
    }, await response.text());
    for (const key of ["canonical", "og:url"]) expect(tags[key]).toEqual([production + path]);
    for (const key of ["og:title", "twitter:title"]) expect(tags[key]).toEqual([title]);
    for (const key of ["og:description", "twitter:description"]) expect(tags[key]).toEqual([description]);
    expect(tags["og:image:alt"]).toEqual([expect.stringContaining(title)]);
    expect(tags["twitter:image:alt"]).toEqual(tags["og:image:alt"]);
    expect(tags["twitter:card"]).toEqual(["summary_large_image"]);
    expect(tags["og:image:width"]).toEqual(["1200"]);
    expect(tags["og:image:height"]).toEqual(["630"]);
    expect(tags["og:image"]).toHaveLength(1);
    expect(tags["twitter:image"]).toEqual(tags["og:image"]);

    const url = new URL(tags["og:image"][0]);
    expect(url.href).toBe(production + url.pathname);
    const key = path === "/" ? "home" : path.split("/").at(-1);
    expect(url.pathname).toMatch(new RegExp(`^/share/${key}-[0-9a-f]+\\.png$`));
    imageUrls.add(url.href);
    // 배포 전 CI에서는 동일한 경로의 로컬 빌드 파일을 확인한다.
    const png = await request.get(url.pathname, { maxRedirects: 0 });
    expect(png.status()).toBe(200);
    expect(png.headers()["content-type"]).toMatch(/^image\/png\b/);
    const bytes = await png.body();
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
    imageDigests.add(createHash("sha256").update(bytes).digest("hex"));
  }
  expect(imageUrls.size).toBe(pages.length);
  expect(imageDigests.size).toBe(pages.length);
});
