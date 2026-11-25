import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";

const manufacturing = cases.find((item) => item.slug === "manufacturing-performance")!;
const detail = `/work/${manufacturing.slug}`;
const measurement = "탭 10개 · 클릭 후 대상 탭 표시 감지 시간 중앙값";

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

for (const [screen, url] of [["홈", "/"], ["제조 상세", detail]]) {
  test(`${screen} 도해에 대상 탭 표시 감지 시간의 중앙값과 단축률을 표시한다`, async ({ page }) => {
    await page.goto(url);
    const figure = page.getByRole("figure").filter({ has: page.locator("figcaption").filter({ hasText: measurement }) });
    await expect(figure.locator("figcaption")).toBeVisible();
    await expect(figure.getByText("82.1% 단축", { exact: true })).toBeVisible();

    for (const [label, value] of [["개선 전", "14.50 ms"], ["개선 후", "2.60 ms"]]) {
      const term = figure.getByRole("term").filter({ hasText: label });
      await expect(term).toBeVisible();
      const reading = term.locator("+ dd");
      await expect(reading).toHaveText(value);
      await expect(reading).toBeVisible();
    }
  });
}

test("제조 측정 도해를 다른 상세 페이지에는 노출하지 않는다", async ({ page }) => {
  for (const item of cases.filter((item) => item.slug !== manufacturing.slug)) {
    await page.goto(`/work/${item.slug}`);
    const article = page.getByRole("article");
    await expect(article.getByRole("heading", { level: 1 })).toHaveText(item.title);
    await expect(article.getByRole("figure").filter({ hasText: measurement })).toHaveCount(0);
  }
});
