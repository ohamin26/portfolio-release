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
