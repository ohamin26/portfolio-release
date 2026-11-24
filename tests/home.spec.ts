import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";
import { compareTabTiming } from "@/common/data/tab-timing";

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("소개에서 대표 작업, AI 작업 방식, 연락 순으로 읽는다", async ({ page }) => {
  await expect(page.locator("#profile").getByRole("heading", { level: 1 })).toContainText("오하민");
  const sections = page.locator("#profile, #work, #method, #contact");
  expect(await sections.evaluateAll((nodes) => nodes.map(({ id }) => id)))
    .toEqual(["profile", "work", "method", "contact"]);
  await expect(page.locator("#method")).toContainText("에이전트");
});

test("프로필의 대표 작업 링크를 키보드로 열면 대표 작업 영역으로 이동한다", async ({ page }) => {
  const link = page.locator("#profile").getByRole("link", { name: /대표 작업 보기/ });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  await expect(page.locator("#work")).toBeInViewport();
});

test("첫 탭의 건너뛰기 링크가 본문으로 포커스를 옮긴다", async ({ page }) => {
  await page.keyboard.press("Tab");
  const skip = page.locator('a[href="#main-content"]');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("프로필과 연락 영역이 같은 LinkedIn 프로필로 연결된다", async ({ page }) => {
  for (const section of ["profile", "contact"]) {
    const link = page.locator(`#${section}`).getByRole("link", { name: /LinkedIn/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/ohamin/");
  }
});

test("대표 작업에 공용 목록의 모든 사례 제목이 표시된다", async ({ page }) => {
  const work = page.locator("#work");
  for (const item of cases) {
    await expect(work.getByText(item.title, { exact: true })).toBeVisible();
  }
});

test("탭 전환 전후 시간과 단축률을 공용 측정 조건과 함께 보여준다", async ({ page }) => {
  const timing = cases.find((item) => item.tabTiming)?.tabTiming;
  if (!timing) throw new Error("탭 전환 측정값이 없습니다.");
  const comparison = compareTabTiming(timing);
  if (!comparison) throw new Error("탭 전환 단축률을 계산할 수 없습니다.");
  const work = page.locator("#work");
  for (const value of [timing.beforeMs, timing.afterMs]) {
    await expect(work.getByText(`${value.toFixed(2)} ms`, { exact: true })).toBeVisible();
  }
  await expect(work).toContainText(`${comparison.reductionPercent.toFixed(1)}%`);
  await expect(work).toContainText(timing.conditions);
});

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px에서 가로 스크롤 없이 홈을 읽을 수 있다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    expect(await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement;
      return scrollWidth <= clientWidth;
    })).toBe(true);
    await expect(page.locator("#contact").getByRole("link", { name: /LinkedIn/i })).toBeVisible();
  });
}
