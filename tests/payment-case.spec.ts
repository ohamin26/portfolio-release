import { expect, test, type Page } from "@playwright/test";

const detail = "/work/payment-recovery";
const beforeApproval = "승인 전 검증 실패";
const completed = "승인 후 주문 완료 성공";
const afterApproval = "승인 후 주문 완료 실패";

function card(page: Page, name: string) {
  return page.getByRole("listitem").filter({
    has: page.getByRole("heading", { name, level: 3, exact: true }),
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(detail);
});

test("장바구니를 다시 조회할 때와 승인 직전의 수량·가격 검증을 구분해 설명한다", async ({ page }) => {
  const policy = page.getByRole("figure", { name: "사용자 웹에서 주문 단계별로 확인하는 구매 조건" });
  await expect(policy.getByRole("heading", { level: 3 })).toHaveText([
    "상품 상세", "장바구니에서 주문할 때", "결제 승인 직전",
  ]);
  const cart = card(page, "장바구니에서 주문할 때");
  await expect(cart).toContainText(/다시 (조회|불러)|재조회/);
  await expect(cart).toContainText(/구매 가능(한)? 수량/);

  const confirmation = card(page, "결제 승인 직전");
  await expect(confirmation).toContainText(/주문 정보.*수량/s);
  await expect(confirmation).toContainText(/서버.*(가격|금액)|(가격|금액).*서버/s);
  await expect(confirmation).not.toContainText(/최신 재고|재고.{0,10}(재조회|다시 조회)/);
});

test("승인 전 검증이 실패하면 선주문 취소를 요청하는 경로를 보여준다", async ({ page }) => {
  const branch = card(page, beforeApproval);
  await expect(branch).toContainText("결제 승인을 요청하지 않습니다");
  await expect(branch).toContainText(/선주문 취소(를)? 요청/);
  await expect(branch).not.toContainText(/취소 완료|환불 완료/);
});

test("승인 후 주문 완료 처리에 성공해야 주문을 확정한다", async ({ page }) => {
  const branch = card(page, completed);
  await expect(branch).toContainText(/요청이 성공해야 주문 완료 화면으로 이동합니다/);
  await expect(branch).toContainText("주문 확정");
});

test("결제가 승인돼도 주문 완료 처리가 실패하면 완료 화면 대신 별도 오류를 안내한다", async ({ page }) => {
  const branch = card(page, afterApproval);
  await expect(branch).toContainText("주문 완료 화면으로 이동하지 않습니다");
  await expect(branch).toContainText(/(오류|실패).*안내/s);
  await expect(branch).not.toContainText(/환불 완료|자동 환불|취소 완료|재결제/);
});

test("320px에서 승인 전후의 세 결과를 가로 넘침 없이 위에서 아래로 읽는다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  let previousBottom = 0;
  for (const title of [beforeApproval, completed, afterApproval]) {
    const branch = card(page, title);
    await expect(branch).toBeVisible();
    const box = (await branch.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(previousBottom);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    previousBottom = box.y + box.height;
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
