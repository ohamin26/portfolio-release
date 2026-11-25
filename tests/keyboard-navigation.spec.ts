import { expect, test } from "@playwright/test";
import { tabThroughLinks } from "./helpers/keyboard";
import { cases } from "@/common/data/cases";

for (const { slug } of cases) {
  test(`${slug}: 첫 Tab과 Enter로 헤더를 건너뛰고 본문에서 탐색한다`, { tag: "@cross-browser" }, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    const skip = page.getByRole("link", { name: "본문 바로가기", exact: true });
    const main = page.getByRole("main");

    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await expect(skip).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(main).toBeFocused();
    await tabThroughLinks(page);

    const firstControl = slug === "scada-interaction"
      ? main.getByRole("radio", { name: "도형 A", exact: true })
      : main.getByRole("link", { name: "대표 작업 목록으로", exact: true });
    await expect(firstControl).toBeFocused();
    await expect(firstControl).toBeInViewport();
  });
}

test("본문 바로가기는 제목이 보이는 위치에서 시작하고 뒤로·앞으로 가기 이력을 유지한다", { tag: "@cross-browser" }, async ({ page }) => {
  const path = "/work/payment-recovery";
  await page.goto(path);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문 바로가기" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(page).toHaveURL(`${path}#main-content`);

  await page.goBack();
  await expect(page).toHaveURL(path);
  await page.goForward();
  await expect(page).toHaveURL(`${path}#main-content`);
});

test.describe("JavaScript를 끈 경우", () => {
  test.use({ javaScriptEnabled: false });

  test("기본 앵커로 본문에 도달한다", { tag: "@cross-browser" }, async ({ page }) => {
    await page.goto("/work/payment-recovery");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "본문 바로가기" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.getByRole("main")).toBeFocused();
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  });
});

test("아래로 스크롤한 상태에서도 바로가기가 본문 시작을 보여 준다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto("/work/payment-recovery");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문 바로가기" })).toBeFocused();
  await page.mouse.wheel(0, 2100);
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).not.toBeInViewport();

  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(title).toBeInViewport();
});
