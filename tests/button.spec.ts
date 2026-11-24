import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import tailwind from "@tailwindcss/postcss";
import { expect, test } from "@playwright/test";
import postcss from "postcss";
import { Button, buttonVariants } from "@/common/components/ui/button";

test.use({ viewport: { width: 375, height: 667 }, reducedMotion: "reduce" });

test("모바일 너비에서 버튼은 키보드로 작동하고, 버튼처럼 보이는 링크는 링크로 남는다", async ({ page }) => {
  const cssPath = resolve("src/common/styles/globals.css");
  const { css } = await postcss([tailwind()]).process(await readFile(cssPath, "utf8"), { from: cssPath });
  const fixture = createElement("form", null,
    createElement(Button, { variant: "outline" }, "자세히"),
    createElement(Button, { disabled: true }, "사용 불가"),
    createElement("a", { href: "#work", className: buttonVariants({ variant: "link" }) }, "작업 목록"),
    createElement(Button, { type: "submit", className: "px-8" }, "저장"),
  );
  await page.setContent(renderToStaticMarkup(fixture));
  await page.addStyleTag({ content: css });
  await page.locator("form").evaluate((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.dataset.submitted = "yes";
    }),
  );

  const button = page.getByRole("button", { name: "자세히" });
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("transition-duration", "0s");
  expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page.locator("form")).not.toHaveAttribute("data-submitted", "yes");

  await expect(page.getByRole("button", { name: "사용 불가" })).toBeDisabled();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "작업 목록" })).toBeFocused();
  await page.keyboard.press("Tab");
  const submit = page.getByRole("button", { name: "저장" });
  await expect(submit).toBeFocused();
  await expect(submit).toHaveClass(/\bpx-8\b/);
  await expect(submit).not.toHaveClass(/\bpx-4\b/);
  await page.keyboard.press("Enter");
  await expect(page.locator("form")).toHaveAttribute("data-submitted", "yes");
});
