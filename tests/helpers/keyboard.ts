import type { Page } from "@playwright/test";

// macOS WebKit 기본 설정에서 일반 링크까지 순회하는 키는 Option+Tab이다.
// 본문 바로가기의 첫 Tab은 이 헬퍼를 사용하지 않고 모든 엔진에서 그대로 검사한다.
export function tabThroughLinks(page: Page) {
  const key = page.context().browser()?.browserType().name() === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab";
  return page.keyboard.press(key);
}
