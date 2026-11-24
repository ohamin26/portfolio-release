import { expect, test } from "@playwright/test";

const detail = "/work/payment-recovery";

test("상품 선택에서 결제 직전까지 구매 조건을 확인하는 순서를 보여준다", async ({ page }) => {
  await page.goto(detail);
  const policy = page.getByRole("article").locator("ol").filter({ hasText: "상품 상세" });
  await expect(policy.getByRole("listitem")).toHaveText([
    /상품 상세/,
    /장바구니.*주문 제출/s,
    /결제 직전/,
  ]);
});

test("같은 선주문에서 재검증 결과에 따라 주문 확정과 취소 요청을 구분한다", async ({ page }) => {
  await page.goto(detail);
  const failedHeading = page.getByRole("heading", { level: 3, name: "검증 실패", exact: true });
  const diagram = page.getByRole("figure").filter({ has: failedHeading });
  await expect(diagram).toContainText(/선주문.*결제창.*가격.*수량.*재검증/s);

  const passed = diagram.getByRole("heading", { level: 3, name: "검증 통과", exact: true }).locator("..");
  await expect(passed).toContainText(/승인 성공.*주문 확정/s);
  const failed = failedHeading.locator("..");
  await expect(failed).toContainText(/승인 중단.*선주문 취소 요청.*사용자 안내/s);
  await expect(failed.getByText("취소 완료", { exact: true })).toHaveCount(0);
});

test("320px 화면에서 두 경로와 결과를 가로 스크롤 없이 위아래로 읽는다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto(detail);
  const passHeading = page.getByRole("heading", { level: 3, name: "검증 통과", exact: true });
  const failHeading = page.getByRole("heading", { level: 3, name: "검증 실패", exact: true });
  await expect(passHeading).toBeVisible();
  await expect(failHeading).toBeVisible();

  await expect(passHeading.locator("..")).toContainText("주문 확정", { useInnerText: true });
  await expect(failHeading.locator("..")).toContainText("사용자 안내", { useInnerText: true });
  const passed = (await passHeading.locator("..").boundingBox())!;
  const failed = (await failHeading.locator("..").boundingBox())!;
  expect(failed.y).toBeGreaterThanOrEqual(passed.y + passed.height);
  for (const card of [passed, failed]) {
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(320);
  }
});
