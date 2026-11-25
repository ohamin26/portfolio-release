import { expect, test, type Page } from "@playwright/test";
import { cases } from "@/common/data/cases";

// 루트 rem이나 뷰포트 대신 현재 화면의 계산된 글자 크기만 두 배로 만든다.
// 라우트 전환 때 이전 규칙을 먼저 제거해 유지된 DOM을 네 배로 키우지 않는다.
async function enlargeText(page: Page) {
  const scale = await page.evaluate(() => {
    document.getElementById("test-text-scale")?.remove();
    const title = document.querySelector("h1")!;
    const before = parseFloat(getComputedStyle(title).fontSize);
    const sizes = new Set<number>();
    for (const el of document.body.querySelectorAll<HTMLElement>("*")) {
      if (!(el instanceof HTMLElement) || !el.getClientRects().length) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      el.dataset.testFontSize = String(size);
      sizes.add(size);
    }
    const style = document.createElement("style");
    style.id = "test-text-scale";
    style.textContent = [...sizes].map((n) => `[data-test-font-size="${n}"]{font-size:${2 * n}px!important}`).join("\n");
    document.head.append(style);
    return parseFloat(getComputedStyle(title).fontSize) / before;
  });
  expect(scale).toBeCloseTo(2, 2);
}

async function expectReadableLayout(page: Page) {
  const problems = await page.evaluate(() => {
    const result = [];
    const width = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > width + 1) result.push("페이지 전체의 가로 넘침");
    // 스크린리더 전용 텍스트·숨은 도해 대신, 실제 보이는 제목·도해·행동을 확인한다.
    const selector = "h1, h2, h3, p, li, figcaption, caption, th, td, dt, dd, label, a";
    const fragments: { rect: DOMRect; name: string }[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const el = node.parentElement;
      const name = node.textContent?.trim();
      if (!name || !el?.closest(selector) || el.closest(".sr-only,[aria-hidden=true]")) continue;
      const range = new Range();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width < 1 || rect.height < 1 || rect.bottom + window.scrollY < 0) continue;
        const action = el.closest("a, label");
        if (action) {
          const box = action.getBoundingClientRect();
          if (rect.top < box.top - 2 || rect.bottom > box.bottom + 2) result.push(`조작 영역 밖의 글자: ${name}`);
        }
        for (let parent: HTMLElement | null = el; parent; parent = parent.parentElement) {
          const css = getComputedStyle(parent);
          const box = parent.getBoundingClientRect();
          if ((/hidden|clip/.test(css.overflowX) && (rect.left < box.left - 2 || rect.right > box.right + 2))
              || (/hidden|clip/.test(css.overflowY) && (rect.top < box.top - 2 || rect.bottom > box.bottom + 2))) {
            result.push(`잘린 글자: ${name}`);
            break;
          }
        }
        for (const other of fragments) {
          const x = Math.min(rect.right, other.rect.right) - Math.max(rect.left, other.rect.left);
          const y = Math.min(rect.bottom, other.rect.bottom) - Math.max(rect.top, other.rect.top);
          if (x > 3 && y > Math.min(rect.height, other.rect.height) * 0.3) {
            result.push(`겹친 글자: ${other.name} / ${name}`);
          }
        }
        fragments.push({ rect, name });
      }
    }
    return [...new Set(result)];
  });
  expect(problems).toEqual([]);
}

for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
  test.describe(`터치 화면 ${viewport.width}×${viewport.height} · 글자 크기 200% 모사`, () => {
    test.use({ viewport, hasTouch: true });

    for (const item of cases) {
      test(`홈에서 ${item.field} 사례를 읽고 목록을 거쳐 연락까지 이동한다`, async ({ page }) => {
        await page.goto("/");
        await enlargeText(page);
        await expectReadableLayout(page);
        await page.getByRole("link", { name: "대표 작업 보기", exact: true }).tap();
        await page.locator("#work").getByRole("link", { name: item.title, exact: true }).tap();

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.title);
        await enlargeText(page);
        await expectReadableLayout(page);
        await page.getByRole("link", { name: "대표 작업 목록으로", exact: true }).tap();

        await expect(page).toHaveURL("/#work");
        await enlargeText(page);
        await expect(page.locator("#work")).toBeFocused();
        await page.getByRole("navigation", { name: "주요 탐색" }).getByRole("link", { name: "연락", exact: true }).tap();
        const contact = page.locator("#contact").getByRole("link", { name: "LinkedIn에서 연락하기" });
        await expect(contact).toBeInViewport();
        await contact.tap({ trial: true }); // 외부 사이트를 열지 않고 실제 터치 가능한지 확인
      });
    }
  });
}
