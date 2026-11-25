"use client";

import type { MouseEvent } from "react";

function moveToMain(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

  const { hash } = event.currentTarget;
  const main = document.getElementById(hash.slice(1));
  if (!main) return;

  // 본문 시작점이 화면 밖이면 기본 앵커가 그 위치로 이동해야 한다.
  const top = main.getBoundingClientRect().top;
  if (top < 0 || top >= document.documentElement.clientHeight) return;

  // 이미 보이면 포커스와 주소만 옮겨, 다음 Tab의 스크롤을 방해하지 않는다.
  main.focus({ preventScroll: true });
  if (document.activeElement !== main) return;
  event.preventDefault();
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
}

export function SkipLink() {
  return (
    <a
      href="#main-content"
      tabIndex={0}
      onClick={moveToMain}
      className="fixed top-2 left-4 z-50 -translate-y-[180%] bg-background px-[18px] py-3 text-foreground focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      본문 바로가기
    </a>
  );
}
