import { expect, test } from "@playwright/test";
import { cases } from "@/common/data/cases";

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("모바일 첫 화면의 소개에서 대표 작업과 AI 작업 방식을 지나 연락으로 이동한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const profile = page.locator("#profile");
  const title = profile.getByRole("heading", { level: 1 });
  await expect(title).toContainText("오하민");
  await expect(title).toBeInViewport();
  const sections = page.locator("#profile, #work, #method, #contact");
  expect(await sections.evaluateAll((nodes) => nodes.map(({ id }) => id)))
    .toEqual(["profile", "work", "method", "contact"]);
  await expect(page.locator("#method")).toContainText("에이전트");
  await page.getByRole("navigation", { name: "주요 탐색" }).getByRole("link", { name: "연락", exact: true }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator("#contact").getByRole("link", { name: "LinkedIn에서 연락하기" })).toBeInViewport();
});

test("헤더 로고는 별도 포커스를 받지 않고 프로필 도해는 좁은 화면에서 숨겨진다", async ({ page }) => {
  const header = page.getByRole("banner");
  const profileLink = header.getByRole("link", { name: "오하민", exact: true });
  await expect(profileLink).toHaveAttribute("href", "#profile");
  await profileLink.focus();
  await page.keyboard.press("Tab");
  await expect(header.getByRole("link", { name: "대표 작업", exact: true })).toBeFocused();

  const caption = page.getByText("하나의 규칙, 여러 화면", { exact: true });
  await page.setViewportSize({ width: 1280, height: 850 });
  await expect(caption).toBeVisible();
  await page.setViewportSize({ width: 390, height: 850 });
  await expect(caption).toBeHidden();
});

test("프로필의 대표 작업 링크를 키보드로 열면 대표 작업 영역으로 이동한다", async ({ page }) => {
  const link = page.locator("#profile").getByRole("link", { name: "대표 작업 보기", exact: true });
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
  for (const [section, name] of [["profile", "LinkedIn"], ["contact", "LinkedIn에서 연락하기"]]) {
    const link = page.locator(`#${section}`).getByRole("link", { name, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/ohamin/");
  }
});

for (const width of [390, 1280]) {
  test(`${width}px 홈에서 프로필 표기와 세 사례 링크, 후속 두 행의 문구를 확인한다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const profileLabel = page.locator("#profile").getByText(/^PROFILE\s*\//);
    await expect(profileLabel).toHaveText("PROFILE / OH HAMIN");
    const rows = page.locator("#work").getByRole("article");
    await expect(rows).toHaveCount(cases.length);
    for (const [index, item] of cases.entries()) {
      const row = rows.nth(index);
      const link = row.getByRole("link", { name: item.title, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", `/work/${item.slug}`);
      if (index > 0) {
        const number = String(index + 1).padStart(2, "0");
        await expect(row).toHaveText(`${number} ${item.field} ${item.title}`, { useInnerText: true });
      }
    }
  });
}

test("홈의 기기 비교는 모바일에서 표 다음에 터치 예시를, 데스크톱에서는 두 예시를 나란히 보여준다", async ({ page }) => {
  const work = page.locator("#work");
  const table = work.getByRole("table", { name: "자재 불출", exact: true });
  const touch = work.getByText("현장 입력", { exact: true });
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    const desktopBox = (await table.boundingBox())!;
    const touchBox = (await touch.boundingBox())!;
    if (width === 390) {
      expect(touchBox.y).toBeGreaterThanOrEqual(desktopBox.y + desktopBox.height);
    } else {
      expect(touchBox.x).toBeGreaterThanOrEqual(desktopBox.x + desktopBox.width);
      expect(touchBox.y).toBeLessThan(desktopBox.y + desktopBox.height);
    }
  }
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
