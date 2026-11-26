import { expect, test, type Page } from "@playwright/test";
import { tabThroughLinks } from "./helpers/keyboard";
import { cases, type PortfolioCase } from "@/common/data/cases";

function findCard(page: Page, item: PortfolioCase) {
  const work = page.locator("#work");
  const title = page.getByRole("button", { name: item.title, exact: true });
  const row = work.getByRole("article").filter({ has: title });
  return { title: row.getByRole("button", { name: item.title, exact: true }), detail: row.getByRole("link", { name: /상세 보기/ }) };
}

for (const [index, item] of cases.entries()) {
  test(`펼쳐진 카드의 상세 보기에서 ${item.slug} 사례를 연다`, async ({ page }) => {
    await page.goto("/");
    const { title, detail } = findCard(page, item);
    if (index > 0) await title.click();
    await expect(detail).toHaveAttribute("href", `/work/${item.slug}`);
    await detail.click();
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

async function returnToWorkByKeyboard(page: Page, item: PortfolioCase) {
  const back = page.getByRole("link", { name: "대표 작업 목록으로", exact: true });
  await expect(back).toHaveAttribute("href", "/#work");
  await back.press("Enter");
  await expect(page).toHaveURL("/#work");
  const { title, detail } = findCard(page, item);
  await expect(title).toHaveAttribute("aria-expanded", "true");
  await expect(title).toBeFocused();
  await expect(title).toBeInViewport();
  await tabThroughLinks(page);
  await expect(detail).toBeFocused();
}

test("직접 주소로 연 사례에서 목록으로 돌아와도 읽던 카드부터 탐색한다", { tag: "@cross-browser" }, async ({ page }) => {
  const item = cases[1];
  await page.goto(`/work/${item.slug}`);
  await returnToWorkByKeyboard(page, item);
});

test("키보드로 대표 작업을 펼치고 상세를 읽은 뒤 새 문서 로드 없이 읽던 카드로 돌아온다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto("/");
  const item = cases[2];
  const { title, detail } = findCard(page, item);
  await title.focus();
  await page.keyboard.press("Space");
  await expect(title).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Enter");
  await expect(title).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(title).toHaveAttribute("aria-expanded", "true");
  await tabThroughLinks(page);
  await expect(detail).toBeFocused();
  const documentStart = await page.evaluate(() => performance.timeOrigin);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.title);
  await page.getByRole("radio", { name: "도형 B", exact: true }).click();
  await expect(page.getByRole("table", { name: "측정점 01 · 조회 내역" })).toBeVisible();

  await returnToWorkByKeyboard(page, item);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentStart);
});

test("브라우저 뒤로 가기는 원래 홈 주소와 읽던 카드의 펼침·포커스를 복구한다", { tag: "@cross-browser" }, async ({ page }) => {
  const item = cases[1];
  const homeURL = "/#work";
  await page.goto(homeURL);
  const { title, detail } = findCard(page, item);
  await title.click();
  await detail.click();
  await expect(page).toHaveURL(`/work/${item.slug}`);
  await page.goBack();

  await expect(page).toHaveURL(homeURL);
  await expect(title).toHaveAttribute("aria-expanded", "true");
  await expect(title).toBeFocused();
  await expect(title).toBeInViewport();
  await page.goForward();
  await expect(page).toHaveURL(`/work/${item.slug}`);
  // 새 홈 방문은 앞서 기록한 다른 홈 이력의 선택을 가져오지 않는다.
  await page.getByRole("link", { name: "오하민 포트폴리오 홈" }).click();
  await expect(page).toHaveURL("/");
  await expect(findCard(page, cases[0]).title).toHaveAttribute("aria-expanded", "true");
  await expect(title).toHaveAttribute("aria-expanded", "false");
});

test("키보드로 다음 사례를 이어 읽고 목록에서 마지막 카드로 돌아온다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto("/");
  const documentStart = await page.evaluate(() => performance.timeOrigin);
  await findCard(page, cases[0]).detail.click();

  const nav = page.getByRole("navigation", { name: "사례 탐색" });
  for (const next of cases.slice(1)) {
    await nav.getByRole("link", { name: "대표 작업 목록으로", exact: true }).focus();
    await tabThroughLinks(page);
    const link = nav.getByRole("link", { name: `다음 작업 ${next.title}`, exact: true });
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`/work/${next.slug}`);
    await expect(page.getByRole("heading", { name: next.title, level: 1 })).toBeInViewport();
  }
  await expect(nav.getByRole("link")).toHaveCount(1);
  await returnToWorkByKeyboard(page, cases[cases.length - 1]);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentStart);
});

test("등록되지 않은 사례 주소는 HTTP 404를 반환한다", async ({ request }) => {
  const response = await request.get("/work/unknown-portfolio-case", { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

test("320px에서 직접 연 상세는 가로 넘침 없이 다음 편이 있을 때만 제목 링크를 제공한다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  for (const [index, item] of cases.entries()) {
    await page.goto(`/work/${item.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.title);
    const nav = page.getByRole("navigation", { name: "사례 탐색" });
    await expect(nav.getByRole("link", { name: "대표 작업 목록으로", exact: true })).toHaveAttribute("href", "/#work");
    const next = cases.at(index + 1);
    await expect(nav.getByRole("link")).toHaveCount(next ? 2 : 1);
    if (next) {
      const link = nav.getByRole("link", { name: `다음 작업 ${next.title}`, exact: true });
      await expect(link).toHaveAttribute("href", `/work/${next.slug}`);
      await expect(link.getByText(next.title, { exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement;
      return scrollWidth <= clientWidth;
    })).toBe(true);
  }
});
