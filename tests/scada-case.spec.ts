import { expect, test, type Page } from "@playwright/test";

const detail = "/work/scada-interaction";
const title = "설비 도면에서 고른 대상은 차트에 어떻게 연결될까?";
const diagram = (page: Page) => page.getByRole("radiogroup", { name: "설비 도면", exact: true });

async function expectReadings(page: Page, source: string, values: readonly [number, number]) {
  const chart = page.getByRole("figure", { name: `${source} · 시간별 예시 값`, exact: true });
  const table = page.getByRole("table", { name: `${source} · 조회 내역`, exact: true });
  await expect(chart).toContainText(/0\s*[–~-]\s*20/);
  await expect(chart.getByRole("term")).toHaveText(["09:00", "10:00"]);
  await expect(chart.getByRole("definition")).toHaveText(values.map(String));
  await expect(table.getByRole("columnheader")).toHaveText(["시간", "예시 값"]);

  const track = chart.getByRole("definition").first().locator('[aria-hidden="true"]');
  // 선택 직후에는 막대가 이전 값에서 새 값으로 전환 중일 수 있다.
  await expect.poll(() => track.evaluate((element, value) => {
    const trackWidth = element.getBoundingClientRect().width;
    const barWidth = element.firstElementChild?.getBoundingClientRect().width;
    if (trackWidth <= 0 || barWidth === undefined) return Infinity;
    return Math.abs(barWidth - trackWidth * value / 20);
  }, values[0])).toBeLessThanOrEqual(1);
  const rows = table.getByRole("row").filter({ has: page.getByRole("cell") });
  await expect(rows).toHaveCount(2);
  for (const [index, time] of ["09:00", "10:00"].entries()) {
    await expect(rows.filter({ hasText: time }).getByRole("cell", { name: String(values[index]), exact: true })).toBeVisible();
  }
}

test("기존 설비 주소는 새 사례 주소로 영구 이동한다", async ({ page, request }) => {
  const legacy = "/work/equipment-selection";
  const response = await request.get(legacy, { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(new URL(response.headers().location, response.url()).pathname).toBe(detail);
  await page.goto(legacy);
  await expect(page).toHaveURL(detail);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});

test("읽기 전용 연결 설정은 같은 조회 키워드에 도형마다 다른 측정점을 지정한다", async ({ page }) => {
  await page.goto(detail);
  const settings = page.getByRole("table", { name: "도면 요소별 연결 설정", exact: true });
  for (const [shape, point] of [["도형 A", "측정점 02"], ["도형 B", "측정점 01"]]) {
    const row = settings.getByRole("row").filter({ hasText: shape });
    await expect(row).toContainText("조회 지점");
    await expect(row).toContainText(point);
  }
});

test("방향키로 도형을 바꾸면 기존 차트와 표의 조회 대상과 값이 함께 바뀐다", { tag: "@cross-browser" }, async ({ page }) => {
  await page.goto(detail);
  const plan = diagram(page);
  const a = plan.getByRole("radio", { name: "도형 A", exact: true });
  const b = plan.getByRole("radio", { name: "도형 B", exact: true });
  await expect(a).toBeChecked();
  await expectReadings(page, "측정점 02", [12, 18]);

  await page.getByRole("link", { name: "오하민 포트폴리오 홈" }).focus();
  await page.keyboard.press("Tab");
  await expect(a).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(b).toBeFocused();
  await expect(b).toBeChecked();
  await expectReadings(page, "측정점 01", [8, 7]);
  await expect(page.getByRole("figure", { name: "측정점 02 · 시간별 예시 값" })).toHaveCount(0);
  await expect(page.getByRole("table", { name: "측정점 02 · 조회 내역" })).toHaveCount(0);

  await page.keyboard.press("ArrowLeft");
  await expect(a).toBeChecked();
  await expectReadings(page, "측정점 02", [12, 18]);
});

test("도형을 누른 뒤 도면 밖에서 놓으면 조회 대상은 바뀌지 않는다", async ({ page }) => {
  await page.goto(detail);
  const plan = diagram(page);
  await plan.getByText("도형 B", { exact: true }).hover();
  await page.mouse.down();
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await expect(plan.getByRole("radio", { name: "도형 A", exact: true })).toBeChecked();
  await expectReadings(page, "측정점 02", [12, 18]);
});

test.describe("모바일 도면", () => {
  test.use({ viewport: { width: 320, height: 812 }, hasTouch: true });

  test("도형을 터치하면 선택된 측정값을 가로 스크롤 없이 세로로 읽는다", async ({ page }) => {
    await page.goto(detail);
    const plan = diagram(page);
    await plan.getByText("도형 B", { exact: true }).tap();
    await expect(plan.getByRole("radio", { name: "도형 B", exact: true })).toBeChecked();
    await expectReadings(page, "측정점 01", [8, 7]);
    const chart = (await page.getByRole("figure", { name: "측정점 01 · 시간별 예시 값" }).boundingBox())!;
    const table = (await page.getByRole("table", { name: "측정점 01 · 조회 내역" }).boundingBox())!;
    expect(table.y).toBeGreaterThanOrEqual(chart.y + chart.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
});
