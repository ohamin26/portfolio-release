import { expect, test, type Page } from "@playwright/test";

const detail = "/work/equipment-selection";
const records = [
  { time: "09:00", equipment: "설비 A", count: 12 },
  { time: "10:00", equipment: "설비 A", count: 18 },
  { time: "09:00", equipment: "설비 B", count: 8 },
  { time: "10:00", equipment: "설비 B", count: 7 },
];

async function expectResult(page: Page, equipment: string, counts: [number, number]) {
  const chart = page.getByRole("figure", { name: /시간대별 수집 건수/ });
  const table = page.getByRole("table", { name: /수집 내역/ });
  await expect(chart).toHaveAccessibleName(new RegExp(equipment));
  await expect(table).toHaveAccessibleName(new RegExp(equipment));
  await expect(chart).toContainText(new RegExp(`09:00\\s*${counts[0]}\\s*건.*10:00\\s*${counts[1]}\\s*건`, "s"));
  const rows = table.getByRole("row").filter({ has: page.getByRole("cell") });
  const visible = equipment === "전체 설비" ? records : records.filter(row => row.equipment === equipment);
  await expect(rows).toHaveCount(visible.length);
  for (const row of visible) {
    const record = rows.filter({ hasText: row.time }).filter({ hasText: row.equipment });
    await expect(record.getByRole("cell", { name: new RegExp(`^${row.count}(?:\\s*건)?$`) })).toBeVisible();
  }
}

test("방향키로 설비를 바꾸고 전체로 돌아오면 차트와 표가 같은 조회 결과를 보여준다", async ({ page }) => {
  await page.goto(detail);
  await expect(page.getByText(/예시 데이터/).first()).toBeVisible();
  const picker = page.getByRole("radiogroup", { name: "설비 선택", exact: true });
  const all = picker.getByRole("radio", { name: "전체 설비", exact: true });
  await expect(all).toBeChecked();
  await expectResult(page, "전체 설비", [20, 25]);
  await page.getByRole("link", { name: "오하민 포트폴리오 홈" }).focus();
  await page.keyboard.press("Tab");
  await expect(all).toBeFocused();

  for (const [equipment, counts] of [
    ["설비 A", [12, 18]], ["설비 B", [8, 7]], ["전체 설비", [20, 25]],
  ] as const) {
    await page.keyboard.press("ArrowRight");
    const selected = picker.getByRole("radio", { name: equipment, exact: true });
    await expect(selected).toBeFocused();
    await expect(selected).toBeChecked();
    await expectResult(page, equipment, [...counts]);
  }
});

test("설비 선택을 누른 뒤 바깥에서 놓으면 기존 선택과 조회 결과를 유지한다", async ({ page }) => {
  await page.goto(detail);
  const all = page.getByRole("radio", { name: "전체 설비", exact: true });
  const next = page.getByRole("radio", { name: "설비 A", exact: true });
  await expect(all).toBeChecked();

  await next.hover();
  await page.mouse.down();
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await expect(all).toBeChecked();
  await expectResult(page, "전체 설비", [20, 25]);

  await next.click();
  await expect(next).toBeChecked();
  await expectResult(page, "설비 A", [12, 18]);
});

test("수집 내역 표에는 각 값의 의미를 알려 주는 열 머리글이 있다", async ({ page }) => {
  await page.goto(detail);
  const table = page.getByRole("table", { name: "전체 설비 · 수집 내역" });
  await expect(table.getByRole("columnheader")).toHaveText(["시간", "설비", "수집 건수"]);
});

test.describe("모바일 설비 비교", () => {
  test.use({ viewport: { width: 320, height: 812 }, hasTouch: true });

  test("설비를 터치한 뒤 차트와 표를 가로 스크롤 없이 위아래로 읽는다", async ({ page }) => {
    await page.goto(detail);
    const picker = page.getByRole("radiogroup", { name: "설비 선택" });
    await picker.getByText("설비 B", { exact: true }).tap();
    await expect(page.getByRole("radio", { name: "설비 B", exact: true })).toBeChecked();
    await expectResult(page, "설비 B", [8, 7]);
    const chart = (await page.getByRole("figure", { name: /시간대별 수집 건수/ }).boundingBox())!;
    const table = (await page.getByRole("table", { name: /수집 내역/ }).boundingBox())!;
    expect(table.y).toBeGreaterThanOrEqual(chart.y + chart.height);
    for (const box of [chart, table]) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
    }
  });
});
