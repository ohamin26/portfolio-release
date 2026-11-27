import { log } from "node:console";
import { mkdir } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";
import { chromium } from "@playwright/test";
import { cases } from "../src/common/data/cases.ts";
import { caseCard, homeCard, shareImagePath } from "../src/common/lib/share-metadata.ts";

const output = new URL("../public/share/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL("./share-card.html", import.meta.url).href);
  await page.locator("header img").evaluate((img) => img.decode());

  const hasKoreanGlyphs = await page.locator("h1").evaluate((el) => {
    const canvas = el.ownerDocument.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "32px " + el.ownerDocument.defaultView.getComputedStyle(el).fontFamily;
    const draw = (text) => {
      ctx.clearRect(0, 0, 100, 50);
      ctx.fillText(text, 5, 35);
      return canvas.toDataURL();
    };
    return draw("한") !== draw("글");
  });
  if (!hasKoreanGlyphs) throw new Error("카드를 생성하려면 한글 시스템 글꼴이 필요합니다.");

  for (const card of [homeCard, ...cases.map(caseCard)]) {
    await page.locator("section p").evaluate((el, label) => { el.textContent = label; }, card.label);
    const fits = await page.locator("h1").evaluate(async (el, title) => {
      el.textContent = title.replace(", ", ",\n");
      const doc = el.ownerDocument;
      await doc.fonts.ready;
      const range = doc.createRange();
      range.selectNodeContents(el);
      const { left, right } = el.getBoundingClientRect();
      const top = doc.querySelector("header").getBoundingClientRect().bottom;
      return [...range.getClientRects()].every((r) =>
        r.left >= left - 1 && r.right <= right + 1 && r.top > top && r.bottom <= 630 - 60);
    }, card.title);
    if (!fits) throw new Error(`공유 카드 제목이 안전 영역을 벗어났습니다: ${card.key}`);
    const filename = shareImagePath(card).split("/").pop();
    await page.screenshot({ path: fileURLToPath(new URL(filename, output)) });
    log(filename);
  }
} finally {
  await browser.close();
}
