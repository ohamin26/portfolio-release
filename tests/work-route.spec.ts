import { expect, test, type Page } from "@playwright/test";
import { tabThroughLinks } from "./helpers/keyboard";
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

test("각 상세의 ‘내 역할’에는 해당 사례에서 맡은 작업을 표시한다", async ({ page }) => {
  const roleTopics = {
    "manufacturing-performance": ["설비 수리", "기기별", "탭"],
    "payment-recovery": ["사용자 웹", "선주문 취소", "주문 완료"],
    "scada-interaction": ["도면", "차트와 표", "조회"],
  } satisfies Record<(typeof cases)[number]["slug"], string[]>;

  for (const { slug } of cases) {
    await page.goto(`/work/${slug}`);
    const term = page.getByRole("term").filter({ hasText: /^내 역할$/ });
    const role = term.locator("+ dd");
    await expect(role).toBeVisible();
    for (const topic of roleTopics[slug]) await expect(role).toContainText(topic);
  }
});

async function returnToWorkByKeyboard(page: Page) {
  const list = page.locator("#work");
  const back = page.getByRole("link", { name: "대표 작업 목록으로", exact: true });
  await expect(back).toHaveAttribute("href", "/#work");
  await back.press("Enter");
  await expect(page).toHaveURL("/#work");
  await expect(list.getByRole("heading", { name: "대표 작업", exact: true })).toBeInViewport();
  await expect(list).toBeFocused();
  await tabThroughLinks(page);
  await expect(list.getByRole("link", { name: cases[0].title })).toBeFocused();
}

test("직접 주소로 연 사례에서 키보드로 복귀하면 대표 작업 목록부터 탐색을 이어간다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto(`/work/${cases[0].slug}`);
  await returnToWorkByKeyboard(page);
});

test("홈에서 연 도면 요소를 선택한 뒤 새 문서 로드 없이 키보드로 대표 작업 목록에 복귀한다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto("/");
  const item = cases.find(({ slug }) => slug === "scada-interaction")!;
  await page.locator("#work").getByRole("link", { name: item.title }).press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.title);
  await page.getByRole("radio", { name: "도형 B", exact: true }).click();
  await expect(page.getByRole("table", { name: "측정점 01 · 조회 내역" })).toBeVisible();

  const documentStart = await page.evaluate(() => performance.timeOrigin);
  await returnToWorkByKeyboard(page);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentStart);
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
