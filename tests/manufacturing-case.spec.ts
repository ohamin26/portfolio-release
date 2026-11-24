import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";
import { compareTabTiming } from "@/common/data/tab-timing";

const manufacturing = cases.find((item) => item.slug === "manufacturing-performance")!;
const detail = `/work/${manufacturing.slug}`;
const timing = manufacturing.tabTiming;

test("기기별 입력 예시는 같은 품목과 수량을 담고 모바일에서 위아래로 읽힌다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto(detail);
  const architecture = page.getByRole("article").locator("section").filter({ has: page.getByRole("table") });
  await expect(architecture.getByRole("heading", { level: 2 })).toBeVisible();
  const figure = architecture.getByRole("figure");
  const desktop = figure.getByRole("table");
  await expect(desktop.getByRole("cell", { name: "자재 A", exact: true })).toBeVisible();
  await expect(desktop.getByRole("cell", { name: "12개", exact: true })).toBeVisible();

  const touchItem = figure.getByRole("definition").filter({ hasText: /^자재 A$/ });
  await expect(touchItem).toBeVisible();
  await expect(figure.getByRole("definition").filter({ hasText: /^12개$/ })).toBeVisible();
  const tableBox = (await desktop.boundingBox())!;
  const touchBox = (await touchItem.boundingBox())!;
  expect(touchBox.y).toBeGreaterThanOrEqual(tableBox.y + tableBox.height);
});

test("제조 사례의 성능 도해가 홈과 같은 탭 전환 측정값과 조건을 표시한다", async ({ page }) => {
  const change = compareTabTiming(timing)!;
  const values = [timing.beforeMs, timing.afterMs].map((ms) => `${ms.toFixed(2)} ms`);
  const reduction = `${change.reductionPercent.toFixed(1)}% 단축`;
  for (const url of [detail, "/"]) {
    await page.goto(url);
    const scope = url === detail ? page.getByRole("article").locator("section").filter({ hasText: timing.conditions }) : page.locator("#work");
    if (url === detail) await expect(scope.getByRole("heading", { level: 2 })).toBeVisible();
    const figure = scope.getByRole("figure").filter({ hasText: timing.conditions });
    await expect(figure).toBeVisible();
    for (const value of values) {
      await expect(figure.getByText(value, { exact: true })).toBeVisible();
    }
    await expect(figure).toContainText(reduction);
  }
});

test("제조 측정 도해를 다른 상세 페이지에는 노출하지 않는다", async ({ page }) => {
  for (const item of cases.filter((item) => item.slug !== manufacturing.slug)) {
    await page.goto(`/work/${item.slug}`);
    const article = page.getByRole("article");
    await expect(article.getByRole("heading", { level: 1 })).toHaveText(item.title);
    await expect(article.getByRole("figure").filter({ hasText: timing.conditions })).toHaveCount(0);
  }
});
