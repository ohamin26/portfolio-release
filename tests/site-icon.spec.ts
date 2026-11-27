import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";
import { tabThroughLinks } from "./helpers/keyboard";

test("홈과 세 상세 주소에 직접 접속하면 같은 탭 아이콘을 제공한다", { tag: "@cross-browser" }, async ({ page, request }) => {
  const routes = ["/", ...cases.map(({ slug }) => `/work/${slug}`)];
  const urls: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    const icon = page.locator('head link[rel~="icon"]');
    await expect(icon).toHaveCount(1);
    const href = await icon.evaluate((element: HTMLLinkElement) => element.href);
    expect(new URL(href).origin).toBe(new URL(page.url()).origin);
    expect(new URL(href).pathname).toBe("/favicon.ico");
    urls.push(href);
  }

  expect(new Set(urls).size).toBe(1);
  const [favicon] = urls;
  const response = await request.get(favicon);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^image\/(?:x-icon|vnd\.microsoft\.icon)\b/);
  const decoded = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    return image.naturalWidth;
  }, favicon);
  expect(decoded).toBeGreaterThan(0);
});

test("모바일 상세 헤더의 마크는 홈 링크와 함께 보이고 키보드로 홈에 돌아간다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/work/payment-recovery");
  const header = page.getByRole("banner");
  const home = header.getByRole("link", { name: "오하민 포트폴리오 홈", exact: true });
  await expect(home.locator('svg[aria-hidden="true"]')).toBeInViewport({ ratio: 1 });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문 바로가기", exact: true })).toBeFocused();
  await tabThroughLinks(page);
  await expect(home).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);

  const profile = header.getByRole("link", { name: "오하민", exact: true });
  await expect(profile).toHaveAttribute("href", "#profile");
  await expect(profile.locator('svg[aria-hidden="true"]')).toBeInViewport({ ratio: 1 });
});
