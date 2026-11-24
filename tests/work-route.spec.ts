import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";

for (const item of cases) {
  test(`대표 작업 제목에서 ${item.slug} 사례를 연다`, async ({ page }) => {
    await page.goto("/");
    const link = page.locator("#work").getByRole("link", { name: item.title });
    await expect(link).toHaveAttribute("href", `/work/${item.slug}`);
    await link.click();
    await expect(page).toHaveURL(`/work/${item.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.title);
  });
}

test("직접 연 사례마다 고유한 문서 제목과 설명이 있다", async ({ page }) => {
  const descriptions = new Set<string>();
  for (const item of cases) {
    const response = await page.goto(`/work/${item.slug}`);
    expect(response?.status()).toBe(200);
    expect(await page.title()).toContain(item.title);
    const description = page.locator('head meta[name="description"]');
    await expect(description).toHaveAttribute("content", /\S/);
    descriptions.add((await description.getAttribute("content"))!.trim());
  }
  expect(descriptions.size).toBe(cases.length);
});

test("상세 주소로 바로 온 방문자도 키보드로 홈의 대표 작업 목록에 돌아간다", async ({ page }) => {
  await page.goto(`/work/${cases[0].slug}`);
  const back = page.getByRole("link", { name: "대표 작업 목록으로" });
  await back.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/#work");
  await expect(page.locator("#work")).toBeInViewport();
  await expect(page.locator("#work")).toBeFocused();
});

test("등록되지 않은 사례 주소는 HTTP 404를 반환한다", async ({ request }) => {
  const response = await request.get("/work/unknown-portfolio-case", { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

test("모바일 너비에서 상세 본문을 가로 스크롤 없이 읽는다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  for (const item of cases) {
    await page.goto(`/work/${item.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.title);
    expect(await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement;
      return scrollWidth <= clientWidth;
    })).toBe(true);
  }
});
