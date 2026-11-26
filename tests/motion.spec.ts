import { expect, test, type Page } from "@playwright/test";
import { cases } from "@/common/data/cases";

const firstTitle = `work-title-${cases[0].slug}`;
const scada = cases[2];
const profileLayers = "#profile figure svg [data-study-layer]";
const chartBars = 'figure dl dd [aria-hidden="true"] > span';
const crossBrowser = { tag: "@cross-browser" };

test.use({ reducedMotion: "no-preference" });

type Motion = {
  target: string;
  kind: "hero" | "work" | "case" | "bar";
  duration: number;
  distance: number | null;
  visible: boolean;
  atWorkStart?: boolean;
  readings?: { caption: string; values: string[] };
};

declare global {
  interface Window {
    motionLog: Motion[];
    workScrollLog: ScrollBehavior[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.motionLog = [];
    window.workScrollLog = [];
    const scrollTo = window.scrollTo.bind(window);
    window.scrollTo = function (...args: [ScrollToOptions?] | [number, number]) {
      const options = args[0];
      if (document.activeElement?.id === "work" && typeof options === "object" && options.behavior) {
        window.workScrollLog.push(options.behavior);
      }
      if (args.length === 2) return scrollTo(args[0], args[1]);
      return scrollTo(args[0]);
    };
    const scrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (options) {
      if (this.id === "work" && typeof options === "object" && options.behavior) {
        window.workScrollLog.push(options.behavior);
      }
      return scrollIntoView.call(this, options);
    };

    document.addEventListener("animationstart", (event) => {
      const element = event.target;
      if (!(element instanceof Element)) return;
      const target = element.getAttribute("data-study-layer") ?? element.id;
      const animation = element.getAnimations().find(
        (item) => item instanceof CSSAnimation && item.animationName === event.animationName,
      );
      const effect = animation?.effect;
      const bounds = element.getBoundingClientRect();
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      const duration = Number(effect?.getComputedTiming().duration);
      if (element.matches("#profile figure svg [data-study-layer]")) {
        window.motionLog.push({ kind: "hero", target, duration, distance: null, visible });
      } else if (event.animationName === "work-title-arrive") {
        const from = effect instanceof KeyframeEffect ? effect.getKeyframes()[0] : undefined;
        const distance = from?.transform ? new DOMMatrixReadOnly(String(from.transform)).m42 : null;
        const work = document.getElementById("work");
        const atWorkStart = work ? Math.abs(
          work.getBoundingClientRect().top - parseFloat(getComputedStyle(work).scrollMarginTop),
        ) <= 2 : false;
        window.motionLog.push({ kind: "work", target, duration, distance, visible, atWorkStart });
      } else if (event.animationName.toLowerCase().includes("fade")) {
        window.motionLog.push({ kind: "case", target: element.id || element.tagName, duration, distance: null, visible });
      }
    });

    document.addEventListener("transitionrun", (event) => {
      const element = event.target;
      if (!(element instanceof Element) || event.propertyName !== "transform") return;
      if (!element.matches('figure dl dd [aria-hidden="true"] > span')) return;
      const duration = parseFloat(getComputedStyle(element).transitionDuration) * 1000;
      const table = [...document.querySelectorAll("table")].find((item) => item.caption?.textContent?.includes("조회 내역"));
      const values = [...(table?.querySelectorAll("tbody td:last-child") ?? [])].map((cell) => cell.textContent ?? "");
      // 새 측정점과 숫자가 전환의 첫 프레임부터 표시되는지 기록한다.
      window.motionLog.push({
        kind: "bar", target: "", duration, distance: null, visible: true,
        readings: { caption: table?.caption?.textContent ?? "", values },
      });
    });
  });
});

const motions = (page: Page, kind: Motion["kind"]) =>
  page.evaluate((effect) => window.motionLog.filter((entry) => entry.kind === effect), kind);

test("데스크톱 프로필은 본문을 바로 표시하고 SVG 레이어만 한 번 정렬한다", crossBrowser, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto("/");
  await expect(page.locator("#profile-title")).toBeVisible();
  await expect(page.locator("#profile-title")).toHaveCSS("animation-name", "none");
  await expect.poll(async () => (await motions(page, "hero")).map(({ target }) => target).sort()).toEqual(["base", "middle", "top"]);
  expect((await motions(page, "hero")).every(({ duration }) => duration > 0 && duration <= 700)).toBe(true);
  await expect.poll(() => page.locator(profileLayers).evaluateAll((layers) => layers.every((layer) =>
    layer.getAnimations().every(({ playState }) => playState === "finished"),
  ))).toBe(true);
  await page.locator("#work").getByRole("link", { name: /상세 보기/ }).click();
  await expect(page).toHaveURL(`/work/${cases[0].slug}`);
  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: cases[0].title, exact: true })).toBeFocused();
  expect(await motions(page, "hero")).toHaveLength(3);
});

test("일반 휠은 진입 효과를 켜지 않고 명시한 두 링크만 도착 후 첫 제목을 다시 강조한다", crossBrowser, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.mouse.wheel(0, 560);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(await motions(page, "work")).toHaveLength(0);
  await page.evaluate(() => window.scrollTo(0, 0));

  const workLink = page.getByRole("link", { name: "대표 작업 보기", exact: true });
  const menu = page.getByRole("navigation", { name: "주요 탐색" }).getByRole("link", { name: "대표 작업", exact: true });
  for (const [index, link] of [workLink, menu, menu].entries()) {
    await link.press("Enter");
    await expect(page).toHaveURL("/#work");
    await expect(page.locator("#work")).toBeFocused();
    await expect.poll(async () => (await motions(page, "work")).length).toBe(index + 1);
    expect((await motions(page, "work"))[index]).toMatchObject({
      target: firstTitle, distance: 6, duration: 200, visible: true, atWorkStart: true,
    });
  }
  expect(await page.evaluate(() => window.workScrollLog)).toEqual(["smooth", "smooth", "smooth"]);
  await page.goBack();
  await expect(page).toHaveURL("/");
});

test("도착 강조가 시작된 프레임에 다시 이동해도 두 번째 스크롤을 잃지 않는다", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    function revisit(event: AnimationEvent) {
      if (event.animationName !== "work-title-arrive") return;
      document.removeEventListener("animationstart", revisit);
      const menu = document.querySelector<HTMLAnchorElement>('header nav a[href="#work"]')!;
      menu.focus(); // 뷰포트 밖의 메뉴로 실제 포커스와 스크롤을 되돌린 뒤 즉시 재요청
      menu.click();
    }
    document.addEventListener("animationstart", revisit);
  });
  await page.getByRole("link", { name: "대표 작업 보기", exact: true }).press("Enter");
  await expect.poll(async () => (await motions(page, "work")).map(({ atWorkStart }) => atWorkStart))
    .toEqual([true, true]);
  await expect(page.locator("#work")).toBeFocused();
});

test("상세에서 목록으로 돌아오면 마지막 제목에만 효과가 적용되고 곧바로 키보드 탐색을 잇는다", crossBrowser, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  // 직접 열린 상세에서도 돌아가기 링크는 홈의 첫 진입 모션을 재생하지 않는다.
  await page.goto(`/work/${scada.slug}`);
  await page.getByRole("link", { name: "대표 작업 목록으로", exact: true }).press("Enter");
  const titleButton = page.getByRole("button", { name: scada.title, exact: true });
  await expect(page).toHaveURL("/#work");
  await expect(titleButton).toBeFocused();
  await expect(titleButton).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => motions(page, "work")).toMatchObject([
    { target: `work-title-${scada.slug}`, duration: 200, visible: true },
  ]);
  expect(await motions(page, "hero")).toHaveLength(0);
  await expect(page.locator(profileLayers).first()).toHaveCSS("animation-name", "none");
});

test("사례 진입에서는 상세 제목과 소개 두 요소만 제자리에서 180ms 페이드한다", crossBrowser, async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").getByRole("link", { name: /상세 보기/ }).click();
  await expect(page).toHaveURL(`/work/${cases[0].slug}`);
  await expect.poll(async () => (await motions(page, "case")).map(({ target }) => target).sort()).toEqual(["P", "case-title"]);
  const title = page.locator("#case-title");
  const summary = page.locator("#case-title + p");
  for (const element of [title, summary]) {
    await expect(element).toHaveCSS("animation-duration", "0.18s");
    await expect(element).toHaveCSS("animation-delay", "0s");
  }
  await expect(page.getByRole("main")).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("article")).toHaveCSS("animation-name", "none");
});

test("SCADA 선택은 데이터를 먼저 바꾸고 그래프 막대만 150ms간 전환한다", crossBrowser, async ({ page }) => {
  await page.goto(`/work/${scada.slug}`);
  const b = page.getByRole("radio", { name: "도형 B", exact: true });
  await page.getByRole("radio", { name: "도형 A", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(b).toBeChecked();
  const movedBar = { duration: 150, readings: { caption: "측정점 01 · 조회 내역", values: ["8", "7"] } };
  await expect.poll(() => motions(page, "bar")).toMatchObject([movedBar, movedBar]);
});

test("작은 화면에서는 도해에 효과를 붙여도 표시하지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#profile figure")).toBeHidden();
  await page.getByRole("link", { name: "대표 작업 보기", exact: true }).click();
  await expect.poll(() => motions(page, "work")).toMatchObject([{ target: firstTitle, visible: true }]);
  expect(await motions(page, "hero")).toHaveLength(0);
});

test("동작 줄이기에서는 네 효과를 건너뛰되 상세 복귀와 SCADA 선택은 그대로 동작한다", crossBrowser, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.locator(profileLayers).first()).toBeVisible();
  await expect(page.locator(profileLayers).first()).toHaveCSS("animation-name", "none");
  await page.getByRole("link", { name: "대표 작업 보기", exact: true }).press("Enter");
  await expect(page.locator("#work")).toBeFocused();
  await expect(page.locator("#work-title")).toBeInViewport();
  expect(await page.evaluate(() => window.workScrollLog)).not.toContain("smooth");

  const titleButton = page.getByRole("button", { name: scada.title, exact: true });
  await titleButton.press("Enter");
  await page.locator("#work").getByRole("link", { name: /상세 보기/ }).press("Enter");
  await expect(page).toHaveURL(`/work/${scada.slug}`);
  await expect(page.locator("#case-title")).toHaveCSS("animation-name", "none");
  await expect(page.locator("#case-title + p")).toHaveCSS("opacity", "1");

  await page.getByRole("radio", { name: "도형 A", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("table", { name: "측정점 01 · 조회 내역" })).toBeVisible();
  const bar = page.locator(chartBars).first();
  await expect(bar).toHaveCSS("transition-duration", "0s");
  await expect(bar).toHaveCSS("transform", "matrix(0.4, 0, 0, 1, 0, 0)");

  await page.getByRole("link", { name: "대표 작업 목록으로", exact: true }).press("Enter");
  await expect(titleButton).toBeFocused();
  await expect(titleButton).toHaveAttribute("aria-expanded", "true");
  expect(await page.evaluate(() => window.motionLog)).toEqual([]);
});
